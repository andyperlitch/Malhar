/*
 * Copyright (c) 2013 DataTorrent, Inc. ALL Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package com.datatorrent.contrib.kafka;

import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.google.common.util.concurrent.ThreadFactoryBuilder;
import kafka.api.FetchRequest;
import kafka.api.FetchRequestBuilder;
import kafka.api.OffsetRequest;
import kafka.cluster.Broker;
import kafka.common.ErrorMapping;
import kafka.javaapi.FetchResponse;
import kafka.javaapi.PartitionMetadata;
import kafka.javaapi.consumer.SimpleConsumer;
import kafka.message.MessageAndOffset;

/**
 * Simple kafka consumer adaptor used by kafka input operator
 * Properties:<br>
 * <b>timeout</b>: Timeout for connection and ping <br>
 * <b>bufferSize</b>: buffer size of the consumer <br>
 * <b>clientId</b>: client id of the consumer <br>
 * <b>partitionIds</b>: partition id that the consumer want to consume <br>
 * <li> (-1): create #partition threads and consumers to read the topic from different partitions in parallel</li>
 * <br>
 * <b>metadataRefreshInterval</b>: The interval that the monitor thread use to monitor the broker leadership change <br>
 * <b>metadataRetrievalRetry</b>: Maximum retry times for metadata retrieval failures<br>
 * default value is 3 <br>
 * -1: always retry <br>
 * <br>
 *
 * Load balance: <br>
 * <li>Every consumer only connects to leader broker for particular partition once it's created</li>
 * <li>Once leadership change detected(leader broker failure, or server-side reassignment), it switches to the new leader broker</li>
 * <li>For server-side leadership change, see kafka-preferred-replica-election.sh and kafka-reassign-partitions.sh</li>
 * <li>For every physical consumer, it has a separate thread to monitor the leadership for the topic for every #metadataRefreshInterval milliseconds</li>
 * <br>
 * <br>
 * Kafka broker failover: <br>
 * <li>Once broker fail detected, it waits #metadataRefreshInterval to connect to the new leader broker </li>
 * <li>If there are consecutive #metadataRetrievalRetry failures to retrieve the metadata for the topic. It will stop consuming the partition</li>
 * <br>
 *
 * @since 0.9.0
 */
public class SimpleKafkaConsumer extends KafkaConsumer
{
  
  public SimpleKafkaConsumer()
  {
    super();
  }

  public SimpleKafkaConsumer(String topic, int timeout, int bufferSize, String clientId)
  {
    this(topic, timeout, bufferSize, clientId, null);
  }

  public SimpleKafkaConsumer(String topic, int timeout, int bufferSize, String clientId, Set<Integer> partitionIds)
  {
    super(topic);
    this.timeout = timeout;
    this.bufferSize = bufferSize;
    this.clientId = clientId;
    this.partitionIds = partitionIds;
  }

  public SimpleKafkaConsumer(Set<String> brokerList, String topic, int timeout, int bufferSize, String clientId, Set<Integer> partitionIds)
  {
    super(brokerList, topic);
    this.timeout = timeout;
    this.bufferSize = bufferSize;
    this.clientId = clientId;
    this.partitionIds = partitionIds;
  }
  
  private static final Logger logger = LoggerFactory.getLogger(SimpleKafkaConsumer.class);

  /**
   * Track thread for each partition, clean the resource if necessary
   */
  private final transient HashMap<Integer, SimpleConsumer> simpleConsumerThreads = new HashMap<Integer, SimpleConsumer>();
  
  private transient ExecutorService kafkaConsumerExecutor;

  
  private int timeout = 10000;

  /**
   * Default buffer size is 1M
   */
  private int bufferSize = 1024 * 1024;

  /**
   * Default client id prefix is "Kafka_Simple_Client"
   */
  @NotNull
  private String clientId = "Kafka_Simple_Client";
  
  /**
   * interval in between reconnect if one kafka broker goes down in milliseconds 
   */
  private int metadataRefreshInterval = 10000;
  
  
  /**
   * Maximum retry times
   */
  private int metadataRetrievalRetry = 3;
  
  /**
   * You can setup your particular partitionID you want to consume with *simple
   * kafka consumer*. Use this to maximize the distributed performance. 
   * By default it's -1 which means #partitionSize anonymous threads will be
   * created to consume tuples from different partition
   */
  private Set<Integer> partitionIds = new HashSet<Integer>();
  
  
  /**
   * Track offset for each partition, so operator could start from the last serialized state
   */
  private Map<Integer, Long> offsetTrack = new HashMap<Integer, Long>();

  @Override
  public void create()
  {
    super.create();
    List<PartitionMetadata> partitionMetaList = KafkaMetadataUtil.getPartitionsForTopic(brokerSet, topic);
    boolean defaultSelect = (partitionIds == null) || (partitionIds.size() == 0);

    // if partition ids are null or not specified , find all the partitions for
    // the specific topic else create the consumers of specified partition ids
    for (PartitionMetadata part : partitionMetaList) {
      final String clientName = getClientName(part.partitionId());
      logger.info("Create simple consumer and connect to " + part.leader().host() + ":" + part.leader().port() + " [timeout:" + timeout + ", buffersize:" + bufferSize + ", cliendid:" + clientName + "]");
      if (defaultSelect || partitionIds.contains(part.partitionId())) {
        simpleConsumerThreads.put(part.partitionId(), new SimpleConsumer(part.leader().host(), part.leader().port(), timeout, bufferSize, clientName));
      }
    }

  }

  @Override
  public void start()
  {
    super.start();
    
    // thread to consume the kafka data
    kafkaConsumerExecutor = Executors.newFixedThreadPool(simpleConsumerThreads.size(), new ThreadFactoryBuilder().setNameFormat("kafka-consumer-" + topic + "-%d").build());
    
    // background thread to monitor the kafka metadata change
    final ScheduledExecutorService timerExecutor = Executors.newScheduledThreadPool(simpleConsumerThreads.size(), new ThreadFactoryBuilder()
    .setNameFormat("kafka-consumer-monitor-" + topic + "-%d").setDaemon(true).build());
    for (final Integer pid : simpleConsumerThreads.keySet()) {
      //  initialize the stats snapshot for this partition
      statsSnapShot.mark(pid, 0);
      final String clientName = getClientName(pid);
      kafkaConsumerExecutor.submit(new Runnable() {
        
        SimpleConsumer csInThread = simpleConsumerThreads.get(pid);
        
        int retryCounter = 0;
        
        @Override
        public void run()
        {
          // start a monitor thread to monitor the metadata change and trigger some action on the change  
          timerExecutor.scheduleAtFixedRate(new Runnable(){
            @Override
            public void run()
            {
              if(isAlive && (metadataRetrievalRetry==-1 || retryCounter < metadataRetrievalRetry)){
                logger.debug(Thread.currentThread().getName() + ": Update metadata for topic " + topic);
                List<PartitionMetadata> pms =  KafkaMetadataUtil.getPartitionsForTopic(brokerSet, topic);
                brokerSet.clear();
                PartitionMetadata leaderForPartition = null;
                for (PartitionMetadata pm : pms) {
                  for (Broker b : pm.replicas()) {
                    brokerSet.add(b.host() + ":" + b.port());
                  }
                  if(pm.partitionId()==pid){
                    leaderForPartition = pm;
                  }
                }
                if(leaderForPartition == null){
                  retryCounter++;
                  return;
                }
                retryCounter = 0;
                if(csInThread.host().equals(leaderForPartition.leader().host()) && csInThread.port() == leaderForPartition.leader().port()){
                  return;
                }
                logger.info("Find leader broker change, try to reconnect to leader broker " + leaderForPartition.leader().host());
                // clean the consumer to reestablish the new connection
                cleanPartition(pid);
                // find a leader broker change
                csInThread = new SimpleConsumer(leaderForPartition.leader().host(), leaderForPartition.leader().port(), timeout, bufferSize, clientName);
                simpleConsumerThreads.put(pid, csInThread);
              }
            }
          }, 0, metadataRefreshInterval, TimeUnit.MILLISECONDS);
          
          
          
          // read either from beginning of the broker or last offset committed by the operator
          long offset = 0L;
          if(offsetTrack.get(pid)!=null){
            //start from recovery
            offset = offsetTrack.get(pid);
          } else {
            long startOffsetReq = initialOffset.equalsIgnoreCase("earliest")? OffsetRequest.EarliestTime() : OffsetRequest.LatestTime();
            offset = KafkaMetadataUtil.getLastOffset(csInThread, topic, pid, startOffsetReq, clientName);
          }
          
          while (isAlive && (metadataRetrievalRetry==-1 || retryCounter < metadataRetrievalRetry)) {

            try {
              FetchRequest req = new FetchRequestBuilder().clientId(clientName).addFetch(topic, pid, offset, bufferSize).build();
              FetchResponse fetchResponse = csInThread.fetch(req);
              

              if (fetchResponse.hasError() && fetchResponse.errorCode(topic, pid) == ErrorMapping.OffsetOutOfRangeCode()) {
                // If OffsetOutOfRangeCode happen, it means all msgs have been consumed, clean the consumer and return
                cleanPartition(pid);
                return;
              } else if (fetchResponse.hasError()) {
                // If error happen, assume
                throw new  Exception("Fetch message error, try to reconnect to new broker");
              }
              
              for(MessageAndOffset msg :  fetchResponse.messageSet(topic, pid)){
                offset = msg.nextOffset();
                putMessage(pid, msg.message());
              }
              offsetTrack.put(pid, offset);
              
            } catch (Exception e) {
              logger.warn("Error read from leader broker, highly likely the leader broker is failing. ", e);
              try {
                // wait for the next metadata update to reconnect
                Thread.sleep(metadataRefreshInterval + 1000);
              } catch (InterruptedException e1) {
                e1.printStackTrace();
              }
            }
          }
        }

      });
    }
  }

  private void cleanPartition(Integer pid)
  {
    SimpleConsumer sc = simpleConsumerThreads.get(pid);
    if (sc != null) {
      sc.close();
    }
    simpleConsumerThreads.remove(pid);
  }

  @Override
  protected void _stop()
  {
    for(int pid : simpleConsumerThreads.keySet()){
      simpleConsumerThreads.get(pid).close();
    }
    simpleConsumerThreads.clear();
    kafkaConsumerExecutor.shutdown();
  }

  public void setBufferSize(int bufferSize)
  {
    this.bufferSize = bufferSize;
  }

  public void setClientId(String clientId)
  {
    this.clientId = clientId;
  }

  public void setTimeout(int timeout)
  {
    this.timeout = timeout;
  }

  public int getBufferSize()
  {
    return bufferSize;
  }

  public String getClientId()
  {
    return clientId;
  }

  public int getTimeout()
  {
    return timeout;
  }
  
  public int getReconnectInterval()
  {
    return metadataRefreshInterval;
  }

  public void setReconnectInterval(int reconnectInterval)
  {
    this.metadataRefreshInterval = reconnectInterval;
  }

  public int getMetadataRetrievalRetry()
  {
    return metadataRetrievalRetry;
  }

  public void setMetadataRetrievalRetry(int metadataRetrievalRetry)
  {
    this.metadataRetrievalRetry = metadataRetrievalRetry;
  }

  @Override
  protected KafkaConsumer cloneConsumer(Set<Integer> partitionIds, Map<Integer, Long> startOffset)
  {
    // create different client for same partition
    SimpleKafkaConsumer  skc = new SimpleKafkaConsumer(brokerSet, topic, timeout, bufferSize, clientId, partitionIds);
    skc.initialOffset = this.initialOffset;
    skc.resetOffset(startOffset);
    return skc;
  }
  
  @Override
  protected KafkaConsumer cloneConsumer(Set<Integer> partitionIds){
    return cloneConsumer(partitionIds, null);
  }

  @Override
  protected void commitOffset()
  {
    // the simple consumer offset is kept in the offsetTrack
    // It's better to do server registry for client in the future. Wait for kafka community come up with more sophisticated offset management
    //TODO https://cwiki.apache.org/confluence/display/KAFKA/Inbuilt+Consumer+Offset+Management#
  }
  
  
  private String getClientName(int pid){
    return clientId + SIMPLE_CONSUMER_ID_SUFFIX + pid;
  }

  @Override
  protected Map<Integer, Long> getCurrentOffsets()
  {
    return offsetTrack;
  }
  
  private void resetOffset(Map<Integer, Long> overrideOffset){
    if(overrideOffset == null){
      return;
    }
    for (Entry<Integer, Long> offset : offsetTrack.entrySet()) {
      offset.setValue(overrideOffset.get(offset.getKey()));
    }
  }


} // End of SimpleKafkaConsumer

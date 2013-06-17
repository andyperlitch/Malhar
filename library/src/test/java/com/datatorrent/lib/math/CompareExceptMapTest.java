/**
 * Copyright (c) 2012-2012 Malhar, Inc. All rights reserved.
 */
package com.datatorrent.lib.math;

import com.datatorrent.lib.math.CompareExceptMap;
import com.datatorrent.lib.testbench.CountAndLastTupleTestSink;

import java.util.HashMap;
import java.util.Map;
import junit.framework.Assert;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 *
 * Functional tests for {@link com.datatorrent.lib.math.CompareExceptMap}<p>
 *
 */
public class CompareExceptMapTest
{
  private static Logger log = LoggerFactory.getLogger(CompareExceptMapTest.class);

  /**
   * Test node logic emits correct results
   */
  @Test
  @SuppressWarnings("SleepWhileInLoop")
  public void testNodeProcessing() throws Exception
  {
    testNodeProcessingSchema(new CompareExceptMap<String, Integer>());
    testNodeProcessingSchema(new CompareExceptMap<String, Double>());
    testNodeProcessingSchema(new CompareExceptMap<String, Float>());
    testNodeProcessingSchema(new CompareExceptMap<String, Short>());
    testNodeProcessingSchema(new CompareExceptMap<String, Long>());
  }

  public void testNodeProcessingSchema(CompareExceptMap oper)
  {
    CountAndLastTupleTestSink compareSink = new CountAndLastTupleTestSink();
    CountAndLastTupleTestSink exceptSink = new CountAndLastTupleTestSink();
    oper.compare.setSink(compareSink);
    oper.except.setSink(exceptSink);

    oper.setKey("a");
    oper.setValue(3.0);
    oper.setTypeEQ();

    oper.beginWindow(0);
    HashMap<String, Number> input = new HashMap<String, Number>();
    input.put("a", 2);
    input.put("b", 20);
    input.put("c", 1000);
    oper.data.process(input);
    input.clear();
    input.put("a", 3);
    input.put("b", 21);
    input.put("c", 30);
    oper.data.process(input);
    oper.endWindow();

    // One for each key
    Assert.assertEquals("number emitted tuples", 1, exceptSink.count);
    for (Map.Entry<String, Number> e: ((HashMap<String, Number>)exceptSink.tuple).entrySet()) {
      if (e.getKey().equals("a")) {
        Assert.assertEquals("emitted value for 'a' was ", new Double(2), e.getValue().doubleValue());
      }
      else if (e.getKey().equals("b")) {
        Assert.assertEquals("emitted tuple for 'b' was ", new Double(20), e.getValue().doubleValue());
      }
      else if (e.getKey().equals("c")) {
        Assert.assertEquals("emitted tuple for 'c' was ", new Double(1000), e.getValue().doubleValue());
      }
    }

    Assert.assertEquals("number emitted tuples", 1, compareSink.count);
    for (Map.Entry<String, Number> e: ((HashMap<String, Number>)compareSink.tuple).entrySet()) {
      if (e.getKey().equals("a")) {
        Assert.assertEquals("emitted value for 'a' was ", new Double(3), e.getValue().doubleValue());
      }
      else if (e.getKey().equals("b")) {
        Assert.assertEquals("emitted tuple for 'b' was ", new Double(21), e.getValue().doubleValue());
      }
      else if (e.getKey().equals("c")) {
        Assert.assertEquals("emitted tuple for 'c' was ", new Double(30), e.getValue().doubleValue());
      }
    }
  }
}
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
package com.datatorrent.contrib.machinedata;

import com.datatorrent.contrib.machinedata.data.MachineInfo;
import com.datatorrent.contrib.machinedata.data.MachineKey;

/**
 * <p>HddInfo class.</p>
 *
 * @since 0.3.5
 */
public class HddInfo extends MachineInfo {

    private int hdd;

    public HddInfo() {
    }

    public HddInfo(MachineKey machineKey, int hdd) {
        super(machineKey);
        this.hdd = hdd;
    }

    public int getHdd() {
        return hdd;
    }

    public void setHdd(int hdd) {
        this.hdd = hdd;
    }
}

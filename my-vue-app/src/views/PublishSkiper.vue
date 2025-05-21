<script setup>
// 地图输入
import MapCard from "@/components/MapCard.vue";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { fromLonLat } from "ol/proj";
import { Style, Fill, Stroke, Circle as CircleStyle } from "ol/style";
import { recordsByDate } from "@/assets/data/recordsByDate";

// 功能输入
import { ref, computed } from "vue";
// 控制表单显示
const showForm = ref(false);

// 表单数据模型
const form = ref({
  origin: "",
  destination: "",
  departure: "",
  arrival: "",
  unloadWindow: "",
  type: "",
  weight: null,
  volume: null,
  allowMerge: false,
  allowTrans: false,
  priority: "",




  
});

function submitForm() {
  console.log("📦 提交物流需求:", form.value);
  // 可选：将表单数据 emit 或发请求给后端
}
</script>

<template>
  <el-row class="publish-company-container" :gutter="20">
    <!-- // ------------------------- 物流输入框------------------------- -->
    <!-- 地图输入卡片 -->
    <el-col :span="16" class="map">
      <MapCard :extraLayers="[]" />

      <el-card class="map-card">
        <!-- 悬浮输入表单 -->
        <div class="form-float-panel">
          <el-button size="small" @click="showForm = !showForm" type="primary">
            {{ showForm ? "Hide Form" : "Publish Demand" }}
          </el-button>

          <el-card v-if="showForm" class="form-panel" shadow="always">
            <el-form :model="form" label-position="top" class="compact-form">
              <!-- 第一行：Origin / Destination -->
              <el-row :gutter="10">
                <el-col :span="12">
                  <el-form-item label="Origin Port">
                    <el-input v-model="form.origin" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="Destination Port">
                    <el-input v-model="form.destination" />
                  </el-form-item>
                </el-col>
              </el-row>

              <!-- 第二行：Departure / Arrival -->
              <el-row :gutter="10">
                <el-col :span="12">
                  <el-form-item label="Departure Window">
                    <el-date-picker v-model="form.departure" type="datetime" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="Arrival Window">
                    <el-date-picker v-model="form.arrival" type="datetime" />
                  </el-form-item>
                </el-col>
              </el-row>

              <!-- 第三行：Load/Unload + Cargo Type -->
              <el-row :gutter="10">
                <el-col :span="12">
                  <el-form-item label="Unload Time">
                    <el-date-picker
                      v-model="form.unloadWindow"
                      type="datetime"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="Cargo Type">
                    <el-input v-model="form.type" />
                  </el-form-item>
                </el-col>
              </el-row>

              <!-- 第四行：Weight / Volume -->
              <el-row :gutter="10">
                <el-col :span="12">
                  <el-form-item label="Cargo Weight (kg)">
                    <el-input-number v-model="form.weight" :min="0" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="Volume (m³)">
                    <el-input-number v-model="form.volume" :min="0" />
                  </el-form-item>
                </el-col>
              </el-row>

              <!-- 第五行：Merge / Transshipment -->
              <el-row :gutter="10">
                <el-col :span="12">
                  <el-form-item label="Allow Merge?">
                    <el-switch v-model="form.allowMerge" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="Transshipment?">
                    <el-switch v-model="form.allowTrans" />
                  </el-form-item>
                </el-col>
              </el-row>

              <!-- 第六行：优先级 -->
              <el-form-item label="Priority">
                <el-select v-model="form.priority" placeholder="Select">
                  <el-option label="Cost" value="Cost" />
                  <el-option label="Time" value="Time" />
                </el-select>
              </el-form-item>

              <!-- 提交按钮 -->
              <el-form-item>
                <el-button type="primary" @click="submitForm">Submit</el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </div>
      </el-card>
    </el-col>

    <!-- // ------------------------- 物流显示框------------------------- -->
    <el-col :span="8" class="info-panel">
      <div
        v-for="(records, date) in recordsByDate"
        :key="date"
        class="daily-section"
      >
        <!-- 日期标题 -->
        <h3>{{ date }}</h3>
        <el-card
          v-for="record in records"
          :key="record.id"
          class="record-card"
          shadow="hover"
        >
          <el-collapse>
            <el-collapse-item>
              <template #title>
                <div style="display: flex; align-items: center">
                  <span style="color: #409eff; font-weight: bold">
                    {{ record.departure.split(" ")[1] }}
                  </span>
                  <span style="margin-left: 12px">
                    {{ record.origin }} → {{ record.destination }}
                  </span>
                </div>
              </template>

              <el-row :gutter="20">
                <el-col :span="12">
                  <div>Cargo: {{ record.type }}</div>
                  <div>Weight: {{ record.weight }} kg</div>
                  <div>Volume: {{ record.volume }} m³</div>
                  <div>Unload: {{ record.unload }}</div>
                </el-col>
                <el-col :span="12">
                  <div>Merge: {{ record.merge }}</div>
                  <div>Transship: {{ record.trans }}</div>
                  <div>Priority: {{ record.priority }}</div>
                </el-col>
              </el-row>
            </el-collapse-item>
          </el-collapse>
        </el-card>
      </div>
    </el-col>
  </el-row>
</template>

<style scoped lang="less">
.form-float-panel {
  position: absolute;
  top: 25px;
  left: 35px;
  z-index: 2000;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-panel {
  width: 320px;
  padding: 0px;
  background-color: rgba(255, 255, 255, 0.75);
  font-size: 13px;
  :deep(.el-form-item) {
    margin-bottom: 8px;
  }
  transform: scale(1);
  transform-origin: top left;
}

.compact-form {
  .el-form-item {
    margin-bottom: 12px;
  }

  .el-input,
  .el-input-number,
  .el-select,
  .el-date-picker {
    width: 100%;
    font-size: 13px;
  }
}

.info-panel {
  padding: 10px;
  max-height: 900px;
  overflow-y: auto;
  background-color: #fff;
}

.record-card {
  margin-bottom: 10px;
  font-size: 13px;
}
</style>
 
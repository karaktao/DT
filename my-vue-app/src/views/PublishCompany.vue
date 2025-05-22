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
import LineString from "ol/geom/LineString";
import { getCenter } from "ol/extent";

// 功能输入
import { ref, computed, onMounted } from "vue";
import proj4 from "proj4";
import { register } from "ol/proj/proj4";
import { transform } from "ol/proj";

import polyline from "@mapbox/polyline";

// 注册EPSG:28992坐标系
proj4.defs(
  "EPSG:28992",
  "+proj=sterea +lat_0=52.1561605555556 +lon_0=5.38763888888889 +k=0.9999079 +x_0=155000 +y_0=463000 +ellps=bessel +towgs84=593.16,26.15,478.54,-6.3239,-0.5008,-5.5487,4.0775 +units=m +no_defs +type=crs"
);
register(proj4);

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

// ========== 增加 RouteLayer ==========

// 创建导航风格样式
const routeStyle = new Style({
  stroke: new Stroke({
    color: "rgba(0, 123, 255, 0.8)", // 主体蓝色，带透明度
    width: 5,
    lineCap: "round",
  }),
});

// 白色虚线（中心线）
const dashedCenterLineStyle = new Style({
  stroke: new Stroke({
    color: "rgba(255, 255, 255, 0.9)", // 白色中心线，稍带透明
    width: 1,
    lineDash: [30, 10, 5, 10],
    lineCap: "round",
  }),
});

// 创建路线图层
const routeLayer = new VectorLayer({
  source: new VectorSource(),
  style: function (feature) {
    return [routeStyle, dashedCenterLineStyle]; // 外边+内边，形成导航路线视觉
  },
});

// Polyline 解码函数（输出为 [lat, lng]）
function decodePolyline(str) {
  let index = 0,
    lat = 0,
    lng = 0,
    coordinates = [];

  while (index < str.length) {
    let b,
      shift = 0,
      result = 0;

    do {
      b = str.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlat = result & 1 ? ~(result >> 1) : result >> 1;
    lat += dlat;

    shift = 0;
    result = 0;
    do {
      b = str.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlng = result & 1 ? ~(result >> 1) : result >> 1;
    lng += dlng;

    coordinates.push([lat / 1e6, lng / 1e6]); // [lat, lng]
  }
  return coordinates;
}
// rd转换为墨卡托并添加图层
function addEurisPaths(paths) {
  const source = routeLayer.getSource();
  source.clear();

  paths.forEach((encoded, index) => {
    if (!encoded || encoded.trim() === "") return;
    const decoded = decodePolyline(encoded); // [y_in_km, x_in_km]
    const projected = decoded.map(([lat, lon]) => fromLonLat([lon, lat])); // ✅ WGS84 → Web Mercator
    const feature = new Feature({
      geometry: new LineString(projected),
    });
    source.addFeature(feature);
    // console.log("📍 解码前坐标:", encoded);
    // console.log("📍 解码后坐标（未经处理）:", decoded);
    // console.log("🗺️ 投影后墨卡托坐标:", projected);
    // console.log("📌 添加路径数：", source.getFeatures().length);
  });
}

onMounted(async () => {
  const res = await fetch(
    "https://www.eurisportal.eu/api/RouteCalculatorV2/CalculateRoute",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        StartISRS: "NLENS006464346400012",
        EndISRS: "NLRTM001021160900209",

        ShipCategory: 0,
        ShipDimensions: {
          Height: 0,
          Width: 0,
          Draught: 0,
          Length: 0,
          CEMT: "string",
        },
        ShipSpeed: 0,
        DepartAt: "2025-05-19T08:50:40.619Z",
        CalculationOptions: {
          ComputationType: "string",
          UseSailingSpeeds: true,
          UsePassageDuration: true,
          UseReducedDimensions: true,
          UseSmartReducedDimensions: true,
          ReturnWaypointTypes: 0,
        },
        ResultFormatting: {
          SplitGeometry: true,
          HideViaPoints: true,
          ResultLanguage: "string",
          TimezoneOffset: 0,
          ReturnTranslatedNames: true,
        },
      }),
    }
  );

  const data = await res.json();
  const paths = data?.Itineraries?.[0]?.Geometry?.paths || [];
  addEurisPaths(paths);
});
</script>

<template>
  <el-row class="publish-company-container" :gutter="20">
    <!-- // ------------------------- 物流输入框------------------------- -->
    <!-- 地图输入卡片 -->
    <el-col :span="16" class="map">
      <!-- 地图卡片 -->
      <MapCard :extraLayers="[routeLayer]" />

      <!-- 悬浮输入表单 -->
      <el-card class="map-card">
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
 
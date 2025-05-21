<script setup>
// ------------------------- 引入依赖与初始化投影支持 -------------------------
import { onMounted, watch } from "vue";
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import XYZ from "ol/source/XYZ";
import Overlay from "ol/Overlay";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";
import proj4 from "proj4";
import { register } from "ol/proj/proj4";
import { get as getProjection } from "ol/proj";
import Zoom from "ol/control/Zoom";

// 添加 props 接收图层
const props = defineProps({
  extraLayers: {
    type: Array, // OpenLayers Layer[] 类型
    default: () => [],
  },
});

// 注册 EPSG:28992 投影 123456
proj4.defs(
  "EPSG:28992",
  "+title=Amersfoort / RD New +proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.9999079 +x_0=155000 +y_0=463000 +ellps=bessel +towgs84=565.2369,50.0087,465.658,0.406857330322398,0.350732676542563,-1.8703473836068,4.0812 +units=m +no_defs"
);
register(proj4);
console.log("✅ EPSG:28992 已注册:", getProjection("EPSG:28992"));

let map, view, osmLayer, esriLayer;

// ------------------------- 初始化地图 -------------------------
onMounted(() => {
  view = new View({
    center: [694118.1989320087, 6829154.600371235],
    zoom: 14,
    projection: "EPSG:3857",
  });

  // 初始化两个底图图层
  osmLayer = new TileLayer({ source: new OSM(), visible: true });
  esriLayer = new TileLayer({
    source: new XYZ({
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    }),
    visible: false,
  });

  // 创建地图实例
  map = new Map({
    target: "map",
    view,
    layers: [osmLayer, esriLayer],
  });

  // 缩放控件
  const zoomControl = new Zoom();
  map.addControl(zoomControl);

  // ✅ 添加传入的图层
  props.extraLayers.forEach((layer) => {
    if (!map.getLayers().getArray().includes(layer)) {
      map.addLayer(layer);
    }
  });
});

// ------------------------- 地图跳转功能 -------------------------
function goTo(place) {
  const coords = {
    eefde: [694118.1989, 6829154.6003],
    delden: [743345.6427, 6844779.7188],
    hengelo: [757391.5712, 6844752.2938],
  };
  view.setCenter(coords[place]);
  view.setZoom(14);
}

// ------------------------- 底图图层切换功能 -------------------------
function toggleLayer(type) {
  osmLayer.setVisible(type === "street");
  esriLayer.setVisible(type === "satellite");
}
</script>


<template>
  <el-card class="map-card">
    <!-- 地图显示容器 -->
    <div id="map" class="map-container"></div>

    <!-- 地图控制按钮组 -->
    <div class="btn-group">
      <!-- 地点跳转按钮：Eefde -->
      <div class="btnsEefde">
        <el-button @click="goTo('eefde')">Eefde</el-button>
      </div>
      <!-- 地点跳转按钮：Delden -->
      <div class="btnsDelden">
        <el-button @click="goTo('delden')">Delden</el-button>
      </div>
      <!-- 地点跳转按钮：Hengelo -->
      <div class="btnsHengelo">
        <el-button @click="goTo('hengelo')">Hengelo</el-button>
      </div>
      <!-- 切换街道图层 -->
      <div class="btnsStreetmap">
        <el-button @click="toggleLayer('street')">Street</el-button>
      </div>
      <!-- 切换卫星图层 -->
      <div class="btnsSatellitemap">
        <el-button @click="toggleLayer('satellite')">Satellite</el-button>
      </div>
    </div>
  </el-card>
</template>

<style scoped>
.map-container {
  height: 850px;
  width: 100%;
}

.btn-group {
  display: flex;
  gap: 6px;
  margin-top: 12px;
  flex-wrap: wrap;
}

.custom-zoom-position {
  position: absolute;
  right: 10px;
  bottom: 10px;
  z-index: 1000;
}

/* 定位默认 Zoom 控件到右下角 */
::v-deep .ol-zoom {
  position: absolute;
  right: 10px;
  bottom: 15px;
  left: auto;
  top: auto;
  z-index: 1000;
}
</style>

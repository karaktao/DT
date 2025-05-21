<script setup>
const getImageurl = (user) => {
  return new URL(`../assets/images/${user}.png`, import.meta.url).href;
};
</script>

<template>
  <el-row class="home" :gutter="20">
    <!-- // ------------------------- 企业logo------------------------- -->
    <el-col :span="8" style="margin-top: 20px">
      <el-card>
        <div class="user">
          <img :src="getImageurl('user')" class="user" />
          <div class="user-info">
            <p>Nobian</p>
            <p>Admin</p>
          </div>
        </div>
        <div class="login-info">
          <p>Nobian</p>
          <p>Admin</p>
        </div>
      </el-card>
    </el-col>

    <!-- // ------------------------- 企业info------------------------- -->
    <el-col :span="16" style="margin-top: 20px">
      <!-- 企业信息 -->
      <el-card>
        <h3 class="section-title">Basic Company Information</h3>
        <div class="info-row-3">
          <span><strong>Company Name:</strong> Twente Logistics B.V.</span>
          <span><strong>Owns Vessels?:</strong> TRUE</span>
          <span><strong>Logistics Contact Person:</strong> David</span>
        </div>
        <div class="info-row-3">
          <span><strong>Contact Email:</strong> contact@twentelog.nl</span>
          <span><strong>Company Address:</strong> Hengelosestraat 123, NL</span>
        </div>

        <h3 class="section-title">Transport Profile</h3>
        <div class="info-row-3">
          <span
            ><strong>Main Cargo Categories:</strong> Building materials,
            Chemicals</span
          >
          <span><strong>Cargo Types:</strong> Bulk cargo, Containers</span>
        </div>

        <h3 class="section-title">Transport Demand Frequency</h3>
        <div class="info-row-3">
          <span><strong>Trip Frequency:</strong> 3 / week</span>
          <span><strong>Tonnage Demand:</strong> 800 tons / week</span>
          <span><strong>Container Demand:</strong> 5 containers / week</span>
        </div>
        <div class="info-row-3">
          <span><strong>Volume Demand:</strong> 100 m³ / week</span>
        </div>

        <h3 class="section-title">Frequently Used Ports & Routes</h3>
        <div class="info-row-3">
          <span><strong>Departure Ports:</strong> Hengelo, Almelo</span>
          <span><strong>Destination Ports:</strong> Rotterdam, Kampen</span>
          <span><strong>Destination Cities:</strong> Amsterdam, Gent (BE)</span>
        </div>

        <h3 class="section-title">Transport Preferences</h3>
        <div class="info-row-3">
          <span><strong>Priority Setting:</strong> Time Priority</span>
          <span
            ><strong>Special Requirements:</strong> Cold Chain, Dangerous
            Goods</span
          >
          <span><strong>Accept Transshipment?</strong> TRUE</span>
        </div>
        <div class="info-row-3">
          <span><strong>Accept Return Trip Sharing?</strong> TRUE</span>
        </div>
      </el-card>
      <!-- 船只信息 -->
      <el-card style="margin-top: 10px">
        <h3 class="section-title">Vessel Information</h3>

        <div class="info-row-3">
          <span><strong>Vessel Name:</strong> MS Delta II</span>
          <span><strong>MMSI Number:</strong> 244690123</span>
          <span><strong>Vessel Type:</strong> Barge / Container</span>
        </div>

        <div class="info-row-3">
          <span><strong>Maximum Draft Depth (m):</strong> 2.5</span>
          <span><strong>Max Load Capacity (tons):</strong> 8000</span>
          <span><strong>Max Volume Capacity (m³):</strong> 1000</span>
        </div>

        <div class="info-row-3">
          <span><strong>Vessel Class:</strong> CEMT Class IV</span>
          <span><strong>Vessel Age (years):</strong> 8</span>
          <span><strong>Operating Company:</strong> IJssel Co.</span>
        </div>

        <div class="info-row-3">
          <span><strong>AIS Data:</strong> location, speed…</span>
          <span
            ><strong>Frequent Cargo Types:</strong> Chemicals, Building
            Materials</span
          >
          <span><strong>Current Cargo:</strong> Construction Steel</span>
        </div>
      </el-card>
      <!-- 船只信息 -->
      <el-card style="margin-top: 10px">
        <h3 class="section-title">Vessel Information</h3>

        <div class="info-row-3">
          <span><strong>Vessel Name:</strong> MS Delta II</span>
          <span><strong>MMSI Number:</strong> 244690123</span>
          <span><strong>Vessel Type:</strong> Barge / Container</span>
        </div>

        <div class="info-row-3">
          <span><strong>Maximum Draft Depth (m):</strong> 2.5</span>
          <span><strong>Max Load Capacity (tons):</strong> 8000</span>
          <span><strong>Max Volume Capacity (m³):</strong> 1000</span>
        </div>

        <div class="info-row-3">
          <span><strong>Vessel Class:</strong> CEMT Class IV</span>
          <span><strong>Vessel Age (years):</strong> 8</span>
          <span><strong>Operating Company:</strong> IJssel Co.</span>
        </div>

        <div class="info-row-3">
          <span><strong>AIS Data:</strong> location, speed…</span>
          <span
            ><strong>Frequent Cargo Types:</strong> Chemicals, Building
            Materials</span
          >
          <span><strong>Current Cargo:</strong> Construction Steel</span>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<style scoped lang="less">
.home {
  height: 100%;
  overflow: hidden;
  .user {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #ccc;
    margin-bottom: 20px;

    img {
      width: 150px;
      height: 150px;
      border-radius: 50%;
      margin-right: 40px;
    }
    .user-info {
      p {
        line-height: 40px;
      }
      .user-info-p {
        color: #999;
      }
      .user-info-admin {
        font-size: 35px;
      }
    }
  }
  .login-info {
    p {
      line-height: 30px;
      font-size: 14px;
      color: #999;
      span {
        color: #666;
        margin-left: 60px;
      }
    }
  }
  .section-title {
    margin: 15px 0 10px;
    font-size: 16px;
    font-weight: 600;
    color: #333;
    border-left: 4px solid #409eff;
    padding-left: 10px;
  }
  .info-row-3 {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    margin-bottom: 12px;
    font-size: 14px;
    color: #555;

    span {
      width: 32%;
      line-height: 1.6;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  .info-row-3 strong {
    font-weight: 600;
    color: #666;
  }
}
</style>
 
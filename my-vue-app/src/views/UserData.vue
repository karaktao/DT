<script setup>
import { reactive, computed, ref } from "vue";
import { recordsByDate } from "@/assets/data/recordsByDate";

// 扁平化数据
const flattenedRecords = computed(() => {
  const result = [];
  for (const date in recordsByDate) {
    recordsByDate[date].forEach((record) => {
      result.push({ date, ...record });
    });
  }
  return result;
});

// 分页逻辑
const currentPage = ref(1);
const pageSize = 10;

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  const end = start + pageSize;
  return flattenedRecords.value.slice(start, end);
});

function handlePageChange(page) {
  currentPage.value = page;
}

function handleEdit(row) {
  console.log("✏️ 编辑记录：", row);
}

function handleDelete(row) {
  console.log("🗑️ 删除记录：", row);
}

// logo获取
const getImageurl = (user) => {
  return new URL(`../assets/images/${user}.png`, import.meta.url).href;
};

// demo数据
const cards = ref([
  {
    title: "Daily Data",
    icon: "el-icon-date",
    vessels: {
      inbound: 12,
      outbound: 15,
    },
    cargo: {
      inbound: 3200,
      outbound: 4100,
    },
  },
  {
    title: "Weekly Data",
    icon: "el-icon-star-on",
    vessels: {
      inbound: 90,
      outbound: 102,
    },
    cargo: {
      inbound: 25000,
      outbound: 27800,
    },
  },
  {
    title: "Monthly Data",
    icon: "el-icon-suitcase",
    vessels: {
      inbound: 390,
      outbound: 410,
    },
    cargo: {
      inbound: 103000,
      outbound: 98000,
    },
  },
]);
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
      <!-- 每日数据 -->
      <el-row :gutter="20" justify="space-between">
        <el-col :span="8" v-for="(card, index) in cards" :key="index">
          <el-card class="custom-card" shadow="hover">
            <div class="card-header">
              <div class="icon-box" :style="{ backgroundColor: card.color }">
                <i :class="card.icon" class="card-icon"></i>
              </div>
              <div class="card-title">{{ card.title }}</div>
            </div>

            <div class="card-section">
              <div class="section-title">Vessels Used</div>
              <div class="metric">
                <strong>Inbound:</strong> {{ card.vessels.inbound }}
              </div>
              <div class="metric">
                <strong>Outbound:</strong> {{ card.vessels.outbound }}
              </div>
            </div>

            <div class="card-section">
              <div class="section-title">Total Cargo Weight</div>
              <div class="metric">
                <strong>Inbound:</strong> {{ card.cargo.inbound }} tons
              </div>
              <div class="metric">
                <strong>Outbound:</strong> {{ card.cargo.outbound }} tons
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <el-card class="table">
        <!-- 输入按钮 -->
        <div class="table-header">
          <el-button type="primary">+ add</el-button>
          <el-form :inline="true">
            <el-form-item label="Enter:">
              <el-input placeholder="Publish Demand"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary"
                >Search .<el-icon><Search /></el-icon
              ></el-button>
            </el-form-item>
          </el-form>
        </div>
        <!--物流信息 -->
        <div class="user-data">
          <div class="user-data">
            <el-table :data="paginatedData" style="width: 100%">
              <el-table-column prop="date" label="Date" width="120" />
              <el-table-column prop="origin" label="origin" width="120" />
              <el-table-column
                prop="destination"
                label="destination"
                width="120"
              />
              <el-table-column prop="departure" label="departure" width="180" />
              <el-table-column prop="arrival" label="arrival" width="180" />
              <el-table-column prop="type" label="type" width="120" />
              <el-table-column prop="weight" label="weight (kg)" width="120" />
              <el-table-column label="operation" width="160">
                <template #default="scope">
                  <el-button
                    size="small"
                    type="primary"
                    @click="handleEdit(scope.row)"
                    >Edit</el-button
                  >
                  <el-button
                    size="small"
                    type="danger"
                    @click="handleDelete(scope.row)"
                    >Delete</el-button
                  >
                </template>
              </el-table-column>
            </el-table>

            <!-- 分页控件 -->
            <el-pagination
              class="pagination"
              background
              layout="prev, pager, next"
              :total="flattenedRecords.length"
              :page-size="pageSize"
              :current-page="currentPage"
              @current-change="handlePageChange"
            />
          </div>
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
  .table {
    margin-top: 20px;
    .table-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px;
      .el-button {
        margin-left: 20px;
      }
    }
    .user-data {
      padding: 2px;
    }
    .pagination {
      margin-top: 10px;
      display: flex;
      justify-content: flex-end;
    }
  }
  .custom-card {
    border-radius: 12px;
    background-color: #fdfdfd;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    padding: 16px;
  }

  .card-header {
    display: flex;
    align-items: center;
    margin-bottom: 14px;
  }

  .icon-box {
    width: 36px;
    height: 36px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    margin-right: 12px;
  }

  .card-icon {
    font-size: 20px;
  }

  .card-title {
    font-size: 18px;
    font-weight: bold;
    color: #333;
  }

  .card-section {
    margin-top: 10px;
    padding-top: 8px;
    border-top: 1px solid #eee;
  }

  .section-title {
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 6px;
    color: #555;
  }

  .metric {
    font-size: 14px;
    margin: 2px 0;
    color: #444;
  }
}
</style>
 
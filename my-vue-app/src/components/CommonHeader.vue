
<template>
  <div class="header">
    <div class="l-content">
      <el-botton class="small">
        <component class="icons" :is="'Menu'" />
      </el-botton>
      <el-breadcrumb separator="/" class="breadcrumb">
        <el-breadcrumb-item :to="{ path: '/' }">Homepage</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- 头像 -->
    <div class="r-content">
      <el-dropdown>
        <span class="el-dropdown-link">
          <img :src="getImageurl(user)" class="user" />
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>Admin Platform</el-dropdown-item>
            <el-dropdown-item>Monitoring Platform</el-dropdown-item>
            <el-dropdown-item>Log out</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
const user = ref("user");
const getImageurl = (user) => {
  return new URL(`../assets/images/${user}.png`, import.meta.url).href;
};
</script>

<style lang="less" scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: #333;
}
.icons {
  width: 20px;
  height: 20px;
}

.l-content {
  display: flex;
  align-items: center;
  .el-button {
    margin-right: 20px;
  }
}
.r-content {
  .user {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
}
:deep(.breadcrumb span) {
  color: #fff !important;
  cursor: pointer !important;
}
</style>
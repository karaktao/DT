<script setup>
import CommonAside from "@/components/CommonAside.vue";
import CommonHeader from "@/components/CommonHeader.vue";
</script>

<template>


  <div class="common-layout">
    <el-container class="lay-container">
        <!-- 左侧导航栏 -->
        <common-aside />
        <!-- 右侧主页内容 -->
        <el-container>
            <!-- 顶部导航栏 -->
            <el-header class="el-header">
                <common-header />
            </el-header>
            <!-- 主体内容 -->
            <el-main class="right-main">
                <router-view />
            </el-main>
        </el-container>
    </el-container>

  </div>
</template>

<style scoped lang="less">
.common-layout,
.lay-container {
  height: 100%;
}
.el-header {
  background-color: #333;
}
</style>
 
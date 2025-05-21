<template>
  <el-aside width="150px" :style="{ backgroundColor: '#545c64' }">
    <el-menu
      router
      :default-active="$route.path"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
    >
      <h3>DT Admin Platform</h3>
      <!-- 一级菜单 -->
      <el-menu-item
        v-for="item in noChildren"
        :index="item.path"
        :key="item.path"
      >
        <component class="icons" :is="item.icon" />
        <span>{{ item.label }}</span>
      </el-menu-item>

      <!-- 二级菜单 -->
      <el-sub-menu
        v-for="item in hasChildren"
        :index="item.path"
        :key="item.path"
      >
        <template #title>
          <component class="icons" :is="item.icon" />
          <span>{{ item.label }}</span>
        </template>

        <el-menu-item-group>
          <el-menu-item
            v-for="subItem in item.children"
            :index="subItem.path"
            :key="subItem.path"
          >
            <component class="icons" :is="subItem.icon" />
            <span>{{ subItem.label }}</span>
          </el-menu-item>
        </el-menu-item-group>
      </el-sub-menu>
    </el-menu>
  </el-aside>
</template>

<script setup>
import { ref, computed } from "vue";
const list = ref([
  {
    path: "/home",
    name: "home",
    label: "Home",
    icon: "house",
    url: "Home",
  },
  {
    path: "/publish",
    name: "publish",
    label: "Publish",
    icon: "UploadFilled",
    children: [
      {
        path: "/company",
        name: "company",
        label: "company",
        icon: "OfficeBuilding",
        url: "Company",
      },
      {
        path: "/skiper",
        name: "skiper",
        label: "skiper",
        icon: "Avatar",
        url: "Skiper",
      },
    ],
  },
  {
    path: "/user",
    name: "user",
    label: "User",
    icon: "user",
    children: [
      {
        path: "/userdata",
        name: "userdata",
        label: "UserData",
        icon: "DataLine",
        url: "userData",
      },
      {
        path: "/userinfo",
        name: "userinfo",
        label: "UserInfo",
        icon: "Document",
        url: "userInfo",
      },
    ],
  },
]);

const noChildren = computed(() => list.value.filter((item) => !item.children)); //筛选出没有子菜单的菜单项，即普通菜单。
const hasChildren = computed(() => list.value.filter((item) => item.children));
</script>

<style lang="less" scoped>
.icons {
  width: 18px;
  height: 18px;
  margin-right: 5px;
}
.el-menu {
  border-right: none;
  h3 {
    line-height: 48px;
    color: #fff;
    text-align: center;
  }
}
.el-aside {
  height: 100%;
  background-color: #545c64;
}
</style>
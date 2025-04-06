<script setup>
import {ref} from 'vue'
import {Menu, Setting} from "@element-plus/icons-vue";

const isCollapse = ref(false)

</script>

<template>

  <el-container class="bg-[#f6f6f6] h-screen">
    <el-header>
      <el-menu
          default-active="/"
          mode="horizontal"
          class="bg-[#ffffff]"
          :collapse="isCollapse"
          router
      >
        <el-menu-item index="/">
          <el-icon>
            <Menu/>
          </el-icon>
          <template #title>解析食谱</template>
        </el-menu-item>
        <el-menu-item index="/word">
          <el-icon>
            <setting/>
          </el-icon>
          <template #title>食谱数据管理</template>
        </el-menu-item>
      </el-menu>
    </el-header>
    <el-main>
      <div class="bg-[#f6f6f6] h-full">
        <router-view/>
      </div>
    </el-main>
  </el-container>
</template>

<style scoped>


</style>

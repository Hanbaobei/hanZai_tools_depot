<script setup>
import {onMounted, ref} from "vue"
import {ElMessage} from "element-plus";
import {http} from "@/utils/http.js";

const search = ref('')
const tableData = ref([])

const onSubmit = async () => {
  try {
    const {data} = await http.Get(`/lexicon/search?keyword=${search.value}`)
    tableData.value = data
  } catch (error) {
    ElMessage.error({
      message: '获取解析列表,error:' + error,
      type: 'error'
    })
  }
}
const fetchData = async () => {
  try {
    const {data} = await http.Get('/lexicon/list')
    tableData.value = data
  } catch (error) {
    ElMessage.error({
      message: '获取解析列表,error:' + error,
      type: 'error'
    })
  }
}

const delLexicon = async () => {
  ElMessage.info({
    message: '暂时无法删除,请联系我!',
    type: 'info'
  })
}
onMounted(async () => {
  await fetchData()
})
</script>

<template>
  <div class="flex flex-col gap-10px p-20px h-full">
    <div class="bg-[#ffffff]  p-20px rounded-xl flex flex-col justify-between gap-xl">
      <el-form-item label="搜索">
        <el-input v-model="search"/>
      </el-form-item>
      <el-button type="primary" @click="onSubmit">查询</el-button>
    </div>
    <div class="bg-[#ffffff]  flex-1 p-20px rounded-xl overflow-x-auto">
      <el-table :data="tableData" style="width: 100%" lazy>
        <el-table-column prop="id" label="ID" width="180"/>
        <el-table-column prop="item" label="中文" width="180"/>
        <el-table-column prop="value" label="英文" width="200"/>
        <el-table-column label="操作" min-width="120">
          <template #default>
            <el-button link type="danger" size="small" @click="delLexicon">删除</el-button>
            <el-button link type="danger" size="small" @click="">修改</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<style scoped>

</style>

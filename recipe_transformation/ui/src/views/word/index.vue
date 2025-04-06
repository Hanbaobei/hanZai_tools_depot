<script setup>
import {onMounted, ref} from "vue"
import {ElMessage} from "element-plus";
import {http} from "@/utils/http.js";

const tableData = ref([])
const fromModel = ref({
  pageNumber: 1,
  pageSize: 10,
  total: 0,
  keyword: undefined
})

const onSubmit = async () => {
  await fetchData()
}
const fetchData = async () => {
  try {
    const {data} = await http.Post('/words/list', {
      ...fromModel.value
    })
    tableData.value = data.list
    fromModel.value.total = data.total
    fromModel.value.pageNumber = data.pageNumber
  } catch (error) {
    ElMessage.error({
      message: '获取解析列表,error:' + error,
      type: 'error'
    })
  }
}

const delWord = async (word) => {
  ElMessage.info({
    message: `暂时无法删除,请联系我!`,
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
        <el-input v-model="fromModel.keyword"/>
      </el-form-item>
      <el-button type="primary" @click="onSubmit">查询</el-button>
    </div>
    <div class="bg-[#ffffff]  flex-1 p-20px rounded-xl overflow-x-auto flex flex-col gap-20px">
      <el-table :data="tableData" height="680" style="width: 100%" lazy>
        <el-table-column prop="id" label="ID" width="100"/>
        <el-table-column prop="word" label="中文"/>
        <el-table-column prop="translation" label="英文"/>
        <el-table-column prop="create_time" label="创建时间" width="220"/>
        <el-table-column label="操作" width="120">
          <template #default="{row}">
            <el-button link type="danger" size="small" @click="delWord(row)">删除</el-button>
            <el-button link type="danger" size="small" @click="">修改</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="flex justify-end">
        <el-pagination
            @currentChange="fetchData"
            v-model:current-page="fromModel.pageNumber"
            background layout="prev, pager, next" :total="fromModel.total"/>
      </div>

    </div>
  </div>
</template>

<style scoped>

</style>

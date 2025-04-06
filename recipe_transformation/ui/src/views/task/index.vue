<script setup>
import {Plus} from "@element-plus/icons-vue"
import {ElMessage} from "element-plus";
import {onMounted, ref} from "vue"
import {download, http} from "@/utils/http.js";

const upload = ref()
const fileList = ref("");
const uuid = ref()
const transformationTable = ref()
const taskData = ref()

// 手动上传
const submitUpload = async () => {
  try {
    const formData = new FormData();
    formData.append('file', fileList.value);
    const {data} = await http.Post('/task/upload', formData);
    transformationTable.value = data.content
    uuid.value = data.id
    ElMessage.success({
      message: '上传成功',
      type: 'success'
    })
  } catch (error) {
    ElMessage.error({
      message: '上传失败,error:' + error,
      type: 'error'
    })
  }
};

const handleChange = (file) => {
  const {raw} = file
  if (raw.type !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    ElMessage.error('只可以上传docx格式食谱文件')
    return false
  }
  fileList.value = file.raw
  return true
}

// 下载
const downloadFile = () => {
  // 发送下载请求
  download.Get(`/task/download/${uuid.value}`, {responseType: 'blob'})
      .then(response => {
        // 从响应头中获取文件名
        const contentDisposition = response.headers['content-disposition'];
        let filename = '幼儿食谱.docx';
        if (contentDisposition && contentDisposition.includes('filename=')) {
          filename = contentDisposition
              .split('filename=')[1]
              .replace(/['"]/g, ''); // 去除可能的引号
        }
        // 创建一个Blob对象
        const blob = new Blob([response.blob()], {type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'})
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url
        link.download = filename
        document.body.appendChild(link)  // 添加到DOM
        link.click()  // 触发下载
        document.body.removeChild(link)  // 移除元素
        URL.revokeObjectURL(url)  // 释放URL对象
      })
      .catch(error => {
        ElMessage.error({
          message: '下载,error:' + error,
          type: 'error'
        })
      });
}

const resetFile = () => {
  fileList.value = ""
  transformationTable.value = ""
  uuid.value = ""
}

// 获取食谱解析任务列表
const fetchData = () => {
  http.Get('/task/list')
      .then(res => {
        taskData.value = res.data
      })
      .catch(err => {
        ElMessage.error({
          message: '获取解析列表,error:' + err,
          type: 'error'
        })
      })
}

const getTransformation = async (doc) => {
  try {
    const {data} = await http.Get("/task/get/" + doc.id);
    transformationTable.value = data.content
    uuid.value = data.id
  } catch (error) {
    ElMessage.error({
      message: '查看解析列表,error:' + error,
      type: 'error'
    })
  }
}

onMounted(() => {
  fetchData()
})

</script>

<template>
  <div class="flex flex-col gap-10px p-20px h-full">
    <div class="flex flex-row gap-xl h-400px w-full">
      <div class="bg-[#ffffff] p-20px rounded-xl h-full w-500px justify-between flex flex-col">
        <p>请选择需要解析的食谱文件:</p>
        <el-upload ref="upload" action="" show-file-list :show-file-list="false" :on-change="handleChange" drag
                   :auto-upload="false" :limit="1"
                   accept=".docx">
          <el-icon class="uploader-icon">
            <Plus/>
          </el-icon>
          <div class="el-upload__text">
            请选择<em>需要解析的食谱文件</em>:
          </div>
          <template #tip>
            <div class="el-upload__tip">
              只可以上传docx格式的文件
            </div>
          </template>
        </el-upload>
        <div class="flex flex-row justify-end">
          <el-button type="primary" @click="submitUpload">上传并解析</el-button>
          <el-button type="danger" @click="resetFile">清空文件</el-button>
        </div>
      </div>
      <div class="bg-[#ffffff] flex-1 flex flex-col p-20px rounded-xl overflow-x-auto h-full ">
        <p>食谱解析列表:</p>
        <el-table :data="taskData" height="350" stripe>
          <el-table-column prop="id" label="id"/>
          <el-table-column prop="name" label="文件名"/>
          <el-table-column prop="status" label="状态" width="100"/>
          <el-table-column prop="create_time" label="上传时间" width="300"/>
          <el-table-column fixed="right" label="操作" width="150">
            <template #default="{row}">
              <el-button type="primary" size="small" @click="getTransformation(row)">查看</el-button>
              <el-button type="danger" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="bg-[#ffffff]  flex-1 p-20px rounded-xl overflow-x-auto" v-if="transformationTable">
      <div class="flex flex-row justify-between">
        <p class="font-size-20px">解析结果</p>
        <el-button type="success" @click="downloadFile">下载解析结果</el-button>
      </div>
      <el-divider/>
      <div v-html="transformationTable"></div>
    </div>
  </div>
</template>

<style scoped>
.uploader {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  text-align: center;
  transition: var(--el-transition-duration-fast);
}

.uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  text-align: center;
}
</style>

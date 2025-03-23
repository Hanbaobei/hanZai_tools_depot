42
// 学生名单数组
const students = ["墨染殇", "空遗香", "蓝之恋", "醉扶月"];
// 状态控制变量
let isRolling = false;    // 是否正在抽选
let intervalId = null;    // 定时器ID
let currentSelected = null; // 当前选中学生
let randomCount = 3;      // 随机抽取人数

/**
 * 获取随机姓名列表
 * @returns {string} 用✨符号连接的选择结果
 */
function getRandomNames() {
  // 洗牌算法随机排序
  const shuffled = [...students].sort(() => 0.5 - Math.random());
  // 截取前N个并用符号连接
  return shuffled.slice(0, randomCount).join("  ✨  ");
}

/**
 * 显示结果弹窗
 * @param {string} names - 要显示的名字字符串
 */
function showResultModal(names) {
  const overlay = document.querySelector(".modal-overlay");
  const content = document.querySelector(".modal-content");
  // 显示遮罩层
  overlay.style.display = "flex";
  // 设置结果文本
  document.getElementById("resultName").textContent = names;
  // 添加动画效果
  setTimeout(() => content.classList.add("show"), 10);
}

// 新增关闭模态窗口函数
function closeModal(e) {
  e.stopPropagation();
  const overlay = document.querySelector(".modal-overlay");
  const content = document.querySelector(".modal-content");
  content.classList.remove("show");
  setTimeout(() => {
    overlay.style.display = "none";
  }, 300);
}

/**
 * 初始化页面
 * 1. 初始化人数选择器
 * 2. 生成学生姓名元素
 */
function initNames() {
  initCountSelector();
  const container = document.querySelector(".name-container");
  // 遍历学生数组创建DOM元素
  students.forEach((name) => {
    const div = document.createElement("div");
    div.className = "name-item";
    div.textContent = name;
    container.appendChild(div);
  });
}

// 新增动态人数选择器初始化函数
function initCountSelector() {
  const countSelect = document.getElementById("count");
  const maxCount = students.length;

  // 清空现有选项
  countSelect.innerHTML = "";

  // 生成1到最大人数的选项
  for (let i = 1; i <= maxCount; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = `随机${i}人`;
    if (i === Math.min(3, maxCount)) option.selected = true;
    countSelect.appendChild(option);
  }

  // 初始化随机人数变量
  randomCount = Math.min(3, maxCount);
}

/**
 * 随机高亮学生姓名
 * 每50ms切换一次高亮状态
 */
function highlightRandom() {
  // 移除前一个高亮样式
  if (currentSelected) {
    currentSelected.classList.remove("active");
  }
  // 生成随机索引并添加高亮
  const randomIndex = Math.floor(Math.random() * students.length);
  currentSelected = document.querySelectorAll(".name-item")[randomIndex];
  currentSelected.classList.add("active");
}

// 开始/暂停点名
function toggleRoll() {
  const btn = document.querySelector("button");
  if (!isRolling) {
    isRolling = true;
    btn.textContent = "暂停抽选";
    intervalId = setInterval(highlightRandom, 50);
  } else {
    isRolling = false;
    btn.textContent = "开始点名";
    clearInterval(intervalId);
    // 修改结果显示逻辑
    const selectedNames = getRandomNames();
    showResultModal(selectedNames);
  }
}

// 在原有变量声明后新增
function setRandomCount(value) {
  randomCount = parseInt(value);
}

// 修改后的closeModal函数
function closeModal(e) {
  const overlay = document.querySelector(".modal-overlay");
  const content = document.querySelector(".modal-content");
  content.classList.remove("show");
  setTimeout(() => {
    overlay.style.display = "none";
  }, 300);
}

// 页面加载完成时初始化
window.onload = initNames;
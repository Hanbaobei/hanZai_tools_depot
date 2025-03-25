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
// 修改侧边栏导入按钮的点击处理
// 修改导入按钮事件绑定方式（移除HTML中的onclick，改为JS统一绑定）
document.querySelector('.import-btn').addEventListener('click', function(e) {
  e.preventDefault();
  e.stopPropagation();
  document.getElementById('fileInput').click();
});

// 修复文件选择器事件监听
document.getElementById('fileInput').addEventListener('change', handleFileSelect);

// 修改toggleRoll函数指定具体按钮
function toggleRoll() {
  const btn = document.getElementById('startBtn'); // 使用唯一ID选择器
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


// 新增标题更新函数
function updateTitle(newTitle) {
  document.querySelector('.title').textContent = newTitle;
}

// 在文件上传处理成功后修改标题逻辑
function handleFileSelect(event) {
  const file = event.target.files[0];
  if (!file) return;

  // 添加文件类型验证
  if (!file.name.endsWith('.txt')) {
    alert('请选择.txt格式的文本文件');
    return;
  }

  const reader = new FileReader();
  
  // 添加错误处理
  reader.onerror = function() {
    alert('文件读取失败，请检查文件编码是否为UTF-8');
  };

  reader.onload = function(e) {
    try {
      const names = e.target.result.split(',').map(name => name.trim());
      const validNames = names.filter(name => name.length > 0);
      
      // 添加空名单校验
      if (validNames.length === 0) {
        alert('文件中未找到有效姓名，请检查格式');
        return;
      }

      students.length = 0;
      students.push(...validNames);
      
      const container = document.querySelector(".name-container");
      container.innerHTML = '';
      generateNameElements();
      initCountSelector();
      // 修改标题更新逻辑，使用输入框的值
      updateTitle(document.getElementById('titleInput').value);
      
      // 重置文件输入
      event.target.value = '';
      
    } catch (error) {
      alert('文件解析错误: ' + error.message);
    }
  };
  
  reader.readAsText(file, 'UTF-8');
}

// 新增生成姓名元素函数
function generateNameElements() {
  const container = document.querySelector(".name-container");
  students.forEach((name) => {
    const div = document.createElement("div");
    div.className = "name-item";
    div.textContent = name;
    container.appendChild(div);
  });
}

// 修改初始化函数
function initNames() {
  initCountSelector();
  generateNameElements();  // 使用新的生成函数
}

function toggleSettings() {
  const sidebar = document.getElementById('settingsSidebar');
  const mask = document.getElementById('sidebarMask');
  sidebar.classList.toggle('active');
  mask.style.display = sidebar.classList.contains('active') ? 'block' : 'none';
}

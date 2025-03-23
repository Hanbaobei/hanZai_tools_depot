let currentStudent = null;
let isAdding = true;

// 初始化学生数据
let students = JSON.parse(localStorage.getItem('students')) || [
    { name: "张三", points: 0, remarks: [] },
    { name: "李四", points: 0, remarks: [] },
    // 添加更多学生...
];

// 新增排序状态变量
let sortDescending = true;

// 初始化时从localStorage读取数据
function init() {
    const savedData = localStorage.getItem('students');
    if (savedData) {
        students = JSON.parse(savedData);
    } else {
        // 默认学生数据
        students = [
            { name: "张三", points: 0, remarks: [] },
            { name: "李四", points: 0, remarks: [] }
        ];
        updateLocalStorage();
    }
    renderStudents();
}

// 修改排序逻辑
function renderStudents() {
    const container = document.getElementById('studentList');
    container.innerHTML = '';
    
    // 根据排序状态排序
    const sortedStudents = [...students].sort((a, b) => 
        sortDescending ? b.points - a.points : a.points - b.points
    );
    
    sortedStudents.forEach(student => {
        // 修复变量声明位置
        const div = document.createElement('div'); // 移动到forEach回调函数内部
        div.className = 'student-item';
        div.innerHTML = `
            <div class="student-main" onclick="showHistoryDialog('${student.name}')">
                <span class="name">${student.name}</span>
                <span class="points">积分: ${student.points}</span>
            </div>
            <div class="controls">
                <button class="add-btn" onclick="event.stopPropagation();showDialog('${student.name}', true)">➕加分</button>
                <button class="remove-btn" onclick="event.stopPropagation();showDialog('${student.name}', false)">➖减分</button>
            </div>
        `;
        
        // 添加历史记录容器
        const historyContainer = document.createElement('div');
        historyContainer.className = 'history-container';
        div.appendChild(historyContainer);

        container.appendChild(div);
    });
}

function showDialog(name, isAdd) {
    currentStudent = students.find(s => s.name === name);
    isAdding = isAdd;
    document.getElementById('dialog').style.display = 'block';
    document.getElementById('remark').value = currentStudent.remarks.slice(-1)[0] || '';
}

function confirmAction() {
    const points = parseInt(document.getElementById('points').value) || 1;
    const remark = document.getElementById('remark').value;
    
    if (remark) {
        currentStudent.remarks.push(remark);
        currentStudent.points += isAdding ? points : -points;
        updateLocalStorage();
        renderStudents();
    }
    
    cancelAction();
}

function cancelAction() {
    document.getElementById('dialog').style.display = 'none';
    document.getElementById('points').value = '';
    document.getElementById('remark').value = '';
}

function updateLocalStorage() {
    localStorage.setItem('students', JSON.stringify(students));
}

// 新增排序切换函数
function toggleSort() {
    sortDescending = !sortDescending;
    document.querySelector('.sort-btn').textContent = 
        sortDescending ? '↓ 按积分排序 ↓' : '↑ 按积分排序 ↑';
    renderStudents();
}

// 确保每次操作都更新存储
function confirmAction() {
    const points = parseInt(document.getElementById('points').value) || 1;
    const remark = document.getElementById('remark').value;
    
    if (remark) {
        currentStudent.remarks.push(remark);
        currentStudent.points += isAdding ? points : -points;
        updateLocalStorage(); // 确保每次操作后保存
    }
    
    cancelAction();
}

function cancelAction() {
    document.getElementById('dialog').style.display = 'none';
    document.getElementById('points').value = '';
    document.getElementById('remark').value = '';
}

function updateLocalStorage() {
    localStorage.setItem('students', JSON.stringify(students));
}

// 初始化
window.onload = init;

// 新增历史记录弹窗函数
function showHistoryDialog(name) {
    const student = students.find(s => s.name === name);
    const dialog = document.getElementById('historyDialog');
    document.getElementById('historyTitle').textContent = name;
    
    const historyItems = student.remarks.map(r => `
        <div class="history-item">
            <span>${r.timestamp}</span>
            <span class="${r.points > 0 ? 'add' : 'remove'}">${r.points > 0 ? '+' : ''}${r.points}</span>
            <span>${r.remark}</span>
        </div>
    `).join('');
    
    document.getElementById('historyItems').innerHTML = historyItems;
    dialog.style.display = 'block';
}

function closeHistoryDialog() {
    document.getElementById('historyDialog').style.display = 'none';
}
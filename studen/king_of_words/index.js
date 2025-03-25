42
// 定义单词列表，每个单词对应一个中文翻译
const words = [
    {word: "apple", translation: "苹果"},
    {word: "banana", translation: "香蕉"},
    {word: "cherry", translation: "樱桃"},
    {word: "date", translation: "枣"},
];
let currentWord; // 当前游戏的单词
let draggedLetter; // 正在被拖拽的字母
let lastMove = null; // 记录最后一次拖拽操作
let correctCount = 0; // 记录正确回答的数量
let startTime; // 记录开始游戏的时间
let timer; // 用于定时更新时间的计时器
let currentUUID;
let gameTime; // 记录游戏用时

// 开始游戏函数
function startGame() {
    // 隐藏游戏信息
    document.getElementById("gameRules").style.display = "none";
    // 清空字母显示区域
    document.getElementById("letters").innerHTML = "";
    // 清空方框显示区域
    document.getElementById("boxes").innerHTML = "";
    // 隐藏奖励提示
    document.getElementById("reward").style.display = "none";
    // 隐藏错误提示
    document.getElementById("error").style.display = "none";
    // 显示游戏信息
    document.getElementById("gameInfo").style.display = "";
    // 隐藏撤回按钮
    document.getElementById("undoButton").style.display = "none";
    // 显示跳过按钮
    document.getElementById("skipButton").style.display = "inline-block";
    // 设置开始按钮为重新开始
    document.getElementById("startButton").textContent = "重新开始";
    // 清空最后一次拖拽记录
    lastMove = null;
    // 随机选择单词
    get_currentWord();
    // 当前游戏时间为0时，重新计时
    if (!timer) {
        startTimer();
    }
    startTime = new Date();
    // 初始化答对数量显示
    document.getElementById(
        "correctCount"
    ).textContent = `答对数量: ${correctCount}`;
    
    // 显示游戏控制按钮
    document.getElementById('skipButton').style.display = 'inline-block';
}

// 随机选择单词
function get_currentWord() {
    currentWord = ""
    // 获取当前单词
    currentWord = words[Math.floor(Math.random() * words.length)];

    // 显示单词提示
    const wordHintElement = document.getElementById("wordHint");
    wordHintElement.innerHTML = `💡 单词提示 ${currentWord.translation}`;
    
    // 将单词拆分为字母数组
    let letters = currentWord.word.split("");
    // 打乱字母顺序
    letters.sort(() => Math.random() - 0.5);
    const lettersDiv = document.getElementById("letters");
    lettersDiv.innerHTML= "";
    const boxesDiv = document.getElementById("boxes");
    boxesDiv.innerHTML= "";
    // 为每个字母创建一个可拖拽的元素
    letters.forEach((letter) => {
        const letterDiv = document.createElement("div");
        letterDiv.className = "letter";
        letterDiv.draggable = true;
        letterDiv.textContent = letter;
        letterDiv.addEventListener("dragstart", dragStart);
        lettersDiv.appendChild(letterDiv);
    });

    // 为每个字母位置创建一个可放置的方框
    for (let i = 0; i < currentWord.word.length; i++) {
        const boxDiv = document.createElement("div");
        boxDiv.className = "box";
        boxDiv.addEventListener("dragover", dragOver);
        boxDiv.addEventListener("drop", drop);
        boxesDiv.appendChild(boxDiv);
    }
}

// 开始计时
function startTimer() {
    // 获取随机字符串UUID
    currentUUID = getRandomUUID();
    startTime = new Date();
    // 启动计时器，每秒更新一次时间
    timer = setInterval(() => {
        const currentTime = new Date();
        const elapsedTime = Math.floor((currentTime - startTime) / 1000);
        const minutes = Math.floor(elapsedTime / 60);
        const seconds = elapsedTime % 60;
        gameTime = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
        document.getElementById(
            "currentTime"
        ).textContent = `游戏时间: ${gameTime}`;
    }, 1000);
}


// 开始拖拽字母时触发的函数
function dragStart(event) {
    draggedLetter = event.target;
}

// 字母拖拽到方框上方时触发的函数
function dragOver(event) {
    event.preventDefault();
}

// 字母放置到方框内时触发的函数
function drop(event) {
    event.preventDefault();
    if (event.target.textContent === "") {
        // 记录最后一次拖拽操作
        lastMove = {
            letter: draggedLetter,
            box: event.target,
        };
        // 显示撤回按钮
        document.getElementById("undoButton").style.display = "inline-block";

        // 将字母放入方框
        event.target.textContent = draggedLetter.textContent;
        // 隐藏被拖拽的字母
        draggedLetter.style.display = "none";

        // 获取所有已填充的方框
        const filledBoxes = document.querySelectorAll(".box");
        let guessedWord = "";
        // 拼接用户输入的单词
        filledBoxes.forEach((box) => {
            guessedWord += box.textContent;
        });

        // 判断用户是否完成了单词输入
        if (guessedWord.length === currentWord.word.length) {
            if (guessedWord === currentWord.word) {
                // 回答正确，显示奖励提示
                document.getElementById("reward").style.display = "block";
                // 隐藏撤回按钮
                document.getElementById("undoButton").style.display = "none";
                // 隐藏跳过按钮
                document.getElementById("skipButton").style.display = "none";
                // 正确数量加1
                correctCount++;
                // 更新答对数量显示
                document.getElementById(
                    "correctCount"
                ).textContent = `答对数量: ${correctCount}`;
                // 将记录添加到排行榜
                addToLeaderboard(currentUUID);
                // 回答正确，继续下一轮游戏
                setTimeout(startGame, 1000); // 延迟2秒开始新游戏
            } else {
                // 回答错误，显示错误提示
                document.getElementById("error").style.display = "block";
                // 显示开始按钮
                document.getElementById("startButton").style.display =
                    "inline-block";
                endGame();
            }
        }
    }
}

// 撤回最后一次拖拽操作的函数
function undoLastMove() {
    if (lastMove) {
        // 清空方框内的字母
        lastMove.box.textContent = "";
        // 显示被撤回的字母
        lastMove.letter.style.display = "inline-block";
        // 清空最后一次拖拽记录
        lastMove = null;
        // 隐藏撤回按钮
        document.getElementById("undoButton").style.display = "none";
        // 隐藏奖励提示
        document.getElementById("reward").style.display = "none";
        // 隐藏错误提示
        document.getElementById("error").style.display = "none";
    }
}

// 跳过当前单词的函数
function skipWord() {
     // 重新选择随机单词
     get_currentWord();
}

// 结束游戏的函数
function endGame() {
    // 清空字母显示区域
    document.getElementById("letters").innerHTML = "";
    // 清空方框显示区域
    document.getElementById("boxes").innerHTML = "";
    // 显示游戏规则
    document.getElementById("gameRules").style.display = "";
    // 显示开始按钮
    document.getElementById("startButton").style.display = "inline-block";
    // 隐藏撤回按钮
    document.getElementById("undoButton").style.display = "none";
    // 隐藏跳过按钮
    document.getElementById("skipButton").style.display = "none";
    // 停止计时器
    clearInterval(timer);
    // 重置时间
    gameTime = ""
    timer = null;
}

// 将记录添加到排行榜的函数
function addToLeaderboard(uuid) {
    // 获取当前时间
    const leaderboardData = JSON.parse(localStorage.getItem("leaderboard")) || [];
    let found = false;
    leaderboardData.forEach((entry) => {
        // 获取记录中的uuid
        const curryuuid = entry.uuid;
        // 如果uuid相同，更新时间和数量
        if (curryuuid === uuid) {
            entry.gameTime = gameTime;
            entry.correctCount = correctCount;
            found = true;
        }
    });
    // 如果没有找到相同的uuid，添加新记录
    if (!found) {
        leaderboardData.push({
            uuid: uuid,
            gameTime : gameTime,
            startTime: startTime,
            correctCount: correctCount,
        });
    }
    localStorage.setItem("leaderboard", JSON.stringify(leaderboardData));
    loadLoaderboard();
}
function loadLoaderboard() {
    // 获取所有的排行数据
    const leaderboardData =JSON.parse(localStorage.getItem("leaderboard")) || [];
    // 获取排行榜元素
    const leaderboard = document.getElementById("leaderboard").getElementsByTagName("tbody")[0];
    leaderboard.innerHTML = ""; // 清空原有数据
    leaderboardData.forEach((entry) => {
        const newRow = leaderboard.insertRow();
        const timeCell = newRow.insertCell(0);
        const countCell = newRow.insertCell(1);
        timeCell.textContent = entry.startTime;
        countCell.textContent = entry.correctCount;
    });
}

function clearLeaderboard() {
    localStorage.removeItem("leaderboard");
    loadLoaderboard(); 
}

function getRandomUUID() {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";

    var uuid = s.join("");
    return uuid;
}


// 页面加载时从 localStorage 中读取数据并更新排行榜
window.onload = function () {
    const leaderboardData =
        JSON.parse(localStorage.getItem("leaderboard")) || [];
    const leaderboard = document
        .getElementById("leaderboard")
        .getElementsByTagName("tbody")[0];
    leaderboardData.forEach((entry) => {
        const newRow = leaderboard.insertRow();
        const timeCell = newRow.insertCell(0);
        const countCell = newRow.insertCell(1);
        timeCell.textContent = entry.startTime;
        countCell.textContent = entry.correctCount;
    });
};

function exitGame() {
    // 停止游戏计时
    clearInterval(timer);
    // 重置游戏状态
    currentWord = null;
    // 隐藏游戏元素
    document.getElementById('undoButton').style.display = 'none';
    document.getElementById('skipButton').style.display = 'none';
    document.getElementById('exitButton').style.display = 'none';
    // 显示开始按钮
    document.getElementById('startButton').style.display = 'inline-block';
    // 清空字母和输入框
    document.getElementById('letters').innerHTML = '';
    document.getElementById('boxes').innerHTML = '';
}

// 在字母创建逻辑中添加触摸事件监听
function createLetterElement(letter) {
    const letterElement = document.createElement('div');
    letterElement.className = 'letter';
    letterElement.textContent = letter;
    
    // 添加触摸事件
    letterElement.addEventListener('touchstart', handleTouchStart);
    letterElement.addEventListener('touchmove', handleTouchMove);
    letterElement.addEventListener('touchend', handleTouchEnd);
    
    // 保持原有鼠标事件
    letterElement.draggable = true;
    letterElement.addEventListener('dragstart', handleDragStart);
    letterElement.addEventListener('dragend', handleDragEnd);
    
    return letterElement;
}

// 新增触摸事件处理函数
let touchOffsetX, touchOffsetY, draggedElement = null;

function handleTouchStart(e) {
    draggedElement = e.target;
    const rect = draggedElement.getBoundingClientRect();
    touchOffsetX = e.touches[0].clientX - rect.left;
    touchOffsetY = e.touches[0].clientY - rect.top;
    e.preventDefault();
}

function handleTouchMove(e) {
    if (!draggedElement) return;
    const x = e.touches[0].clientX - touchOffsetX;
    const y = e.touches[0].clientY - touchOffsetY;
    draggedElement.style.position = 'fixed';
    draggedElement.style.left = x + 'px';
    draggedElement.style.top = y + 'px';
    e.preventDefault();
}

function handleTouchEnd(e) {
    if (!draggedElement) return;
    handleDrop(draggedElement);
    draggedElement.style.position = 'static';
    draggedElement = null;
    e.preventDefault();
}
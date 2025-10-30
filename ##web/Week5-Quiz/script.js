//获取 DOM 元素
const startScreen   = document.getElementById("start-screen");
const quizScreen    = document.getElementById("quiz-screen");
const resultScreen  = document.getElementById("result-screen");
const startButton   = document.getElementById("start-btn");
const questionText  = document.getElementById("question-text");
const answersContainer = document.getElementById("answers-container");
const currentQuestionSpan = document.getElementById("current-question");
const totalQuestionsSpan  = document.getElementById("total-questions");
const scoreSpan = document.getElementById("score");
const finalScoreSpan = document.getElementById("final-score");
const maxScoreSpan   = document.getElementById("max-score");
const resultMessage  = document.getElementById("result-message");
const restartButton  = document.getElementById("restart-btn");
const progressBar    = document.getElementById("progress");

// 题目数据 
const quizQuestions = [
  {
    question: "What is the capital of France?",
    answers: [
      { text: "London", correct: false },
      { text: "Berlin", correct: false },
      { text: "Paris", correct: true },
      { text: "Madrid", correct: false },
    ],
  },
  {
    question: "Which planet is known as the Red Planet?",
    answers: [
      { text: "Venus", correct: false },
      { text: "Mars", correct: true },
      { text: "Jupiter", correct: false },
      { text: "Saturn", correct: false },
    ],
  },
  {
    question: "What is the largest ocean on Earth?",
    answers: [
      { text: "Atlantic Ocean", correct: false },
      { text: "Indian Ocean", correct: false },
      { text: "Arctic Ocean", correct: false },
      { text: "Pacific Ocean", correct: true },
    ],
  },
  {
    question: "Which of these is NOT a programming language?",
    answers: [
      { text: "Java", correct: false },
      { text: "Python", correct: false },
      { text: "Banana", correct: true },
      { text: "JavaScript", correct: false },
    ],
  },
  {
    question: "What is the chemical symbol for gold?",
    answers: [
      { text: "Go", correct: false },
      { text: "Gd", correct: false },
      { text: "Au", correct: true },
      { text: "Ag", correct: false },
    ],
  },
];

//  游戏状态变量
let currentQuestionIndex = 0; // 当前题号
let score = 0;                // 得分
let answersDisabled = false;  // 是否已选答案（防止重复点击）

// 显示总题数
totalQuestionsSpan.textContent = quizQuestions.length;
maxScoreSpan.textContent = quizQuestions.length;

// 事件监听
startButton.addEventListener("click", startQuiz);   // 开始按钮
restartButton.addEventListener("click", restartQuiz); // 重新开始

// 开始游戏
function startQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  scoreSpan.textContent = 0;

  startScreen.classList.remove("active");
  quizScreen.classList.add("active");

  showQuestion(); // 加载第一题
}

// 显示当前题目
function showQuestion() {
  answersDisabled = false; // 重置点击锁
  const currentQuestion = quizQuestions[currentQuestionIndex];

  currentQuestionSpan.textContent = currentQuestionIndex + 1; // 题号
  progressBar.style.width = (currentQuestionIndex / quizQuestions.length) * 100 + "%";

  questionText.textContent = currentQuestion.question;
  answersContainer.innerHTML = ""; // 清空旧按钮

  // 生成答案按钮
  currentQuestion.answers.forEach((answer) => {
    const button = document.createElement("button");
    button.textContent = answer.text;
    button.classList.add("answer-btn");
    button.dataset.correct = answer.correct; // 存储正误
    button.addEventListener("click", selectAnswer);
    answersContainer.appendChild(button);
  });
}

//选择答案
function selectAnswer(event) {
  if (answersDisabled) return; // 已答则直接返回
  answersDisabled = true;

  const selectedButton = event.target;
  const isCorrect = selectedButton.dataset.correct === "true";

  // 给所有按钮添加正确/错误样式
  Array.from(answersContainer.children).forEach((button) => {
    if (button.dataset.correct === "true") {
      button.classList.add("correct");
    } else if (button === selectedButton) {
      button.classList.add("incorrect");
    }
  });

  if (isCorrect) {
    score++;
    scoreSpan.textContent = score;
  }

  setTimeout(() => {
    currentQuestionIndex++;
    if (currentQuestionIndex < quizQuestions.length) {
      showQuestion();
    } else {
      showResults();
    }
  }, 1000);
}

// 显示最终结果
function showResults() {
  quizScreen.classList.remove("active");
  resultScreen.classList.add("active");

  finalScoreSpan.textContent = score;
  const percentage = (score / quizQuestions.length) * 100;

  // 简单评语
  if (percentage === 100) resultMessage.textContent = "满分！你是天才！";
  else if (percentage >= 80) resultMessage.textContent = "太棒了！知识丰富！";
  else if (percentage >= 60) resultMessage.textContent = "不错哦！继续加油！";
  else if (percentage >= 40) resultMessage.textContent = "还需努力，再试一次！";
  else resultMessage.textContent = "别灰心，多学习就会更好！";
}

// 新开始 
function restartQuiz() {
  resultScreen.classList.remove("active");
  startQuiz(); // 直接重新走流程
}
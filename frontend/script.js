const API_URL = "http://localhost:3000/scores";

let username = "";
let score = 0;
let currentQuestionIndex = 0;



const questions = [
    //SORULAR BURAYA YAZILACAK  //CORRECT DEĞERİ CEVABI TEMSİL EDİYOR HANGİ CEVABI DOĞRU SAYMASINI İSTİYORSAN ONU AYARLA
    { question: "Cuma mesajı ne zaman atılır?", answers: ["pazatesi", "cuma", "salı","perşembe",], correct: 1 },
    { question: "İstanbulu kim feth etmiştir?", answers: ["Recep Tayyip Erdoğan", "İsmet İnönü", "Yavuz Sultan Selim", "Fatih Sulan Mehmet"], correct: 1 },
    { question: "5+5-2+2-10?", answers: ["24", "10", "0", "-8"], correct: 1 },
    { question: "Piknik için hangi araç en iyi seçim olur?", answers: ["bisiklet", "kaykay", "doblo", "ufo"], correct: 4 },
    { question: "Elif yıldızın soyadı nedir?", answers: ["elif", "yıldız", "yılmaz", "yıkılmaz"], correct: 4 },
    { question: "Facebook ile ilgili şarkı yapan ünlü sanatçı kimdir", answers: ["Binali Yıldırım", "Namık Kemal", "İsmail YK", "Mustafa Sandal"], correct: 1 },
    { question: "Aya ilk ayak basan kimdir?", answers: ["Neil Armstrong", "Nikola Tesla", "Elon Musk", "Alper Gezeravcı"], correct: 2 },
    { question: "Türkiyenin kaç ili vardır?", answers: ["84", "81", "77", "100"], correct: 4 },
    { question: "Hangisi iki ayaklıdır", answers: ["Timsah", "Kuş", "İnsan", "Balık"], correct: 4 },
    { question: "Karlı havada hangisinin giyilmesi tuhaf olur?", answers: ["Terlik", "Atkı", "Mont", "Kaban"], correct: 3 },
];

const nameScreen = document.getElementById("name-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");
const usernameInput = document.getElementById("username");
const startButton = document.getElementById("start-button");
const questionText = document.getElementById("question-text");
const answersDiv = document.getElementById("answers");
const finalScore = document.getElementById("final-score");
const leaderboardList = document.getElementById("leaderboard");
const restartButton = document.getElementById("restart-button");

startButton.addEventListener("click", () => {
    username = usernameInput.value.trim();
    if (username) {
        nameScreen.style.display = "none";
        quizScreen.style.display = "block";
        loadQuestion();
    } else {
        alert("Lütfen adınızı girin.");
    }
});

function loadQuestion() {
    const question = questions[currentQuestionIndex];
    questionText.textContent = question.question;
    answersDiv.innerHTML = "";

    question.answers.forEach((answer, index) => {
        const button = document.createElement("button");
        button.classList.add("btn", "btn-outline-primary", "mb-2");
        button.textContent = answer;
        button.addEventListener("click", () => checkAnswer(index));
        answersDiv.appendChild(button);
    });
}

function checkAnswer(selectedIndex) {
    const correctIndex = questions[currentQuestionIndex].correct;
    if (selectedIndex !== correctIndex) {
        score += 10;
    }

    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        loadQuestion();
    } else {
        endGame();
    }
}

async function endGame() {
    quizScreen.style.display = "none";
    resultScreen.style.display = "block";
    finalScore.textContent = `${username}, puanın: ${score}`;

    await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: username, score }),
    });

    updateLeaderboard();
}

async function updateLeaderboard() {
    const response = await fetch(API_URL);
    const leaderboard = await response.json();

    leaderboardList.innerHTML = leaderboard
        .sort((a, b) => b.score - a.score)
        .map((entry) => `<li class="list-group-item">${entry.name}: ${entry.score}</li>`)
        .join("");
}

restartButton.addEventListener("click", () => {
    currentQuestionIndex = 0;
    score = 0;
    nameScreen.style.display = "block";
    resultScreen.style.display = "none";
});



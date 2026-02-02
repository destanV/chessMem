import './style.css';
import { fetchRandomPosition } from './api.js';
import { startTimer, stopTimer, resetTimer } from './timer.js';
import { boardConfigs, createBoard } from './board.js';

let difficulty = 0;
let displayTime = 5;
let isPlaying = false;
let lastShownPosition;
let board;

const secondsText = document.querySelector("#seconds");
const newPosButton = document.querySelector("#newPos");
const sendPosButton = document.querySelector("#sendPos");

// Tahta İlk Kurulum
board = createBoard("boardContainer", boardConfigs.view);

// Responsive Ayarı
window.addEventListener("resize", () => {
  let containerWidth = Math.min(window.innerWidth * 0.9, 550);
  board.resize(containerWidth);
});

async function displayPosition() {
  isPlaying = true;
  try {
    const fen = await fetchRandomPosition(difficulty);
    lastShownPosition = fen;
    board.position(fen);
    
    console.log(`Pozisyon ${displayTime} saniye gösteriliyor.`);

    setTimeout(() => {
      console.log("Oyun başladı: Boş tahta");
      board.destroy();
      board = createBoard("boardContainer", boardConfigs.play);
      startTimer(secondsText);
    }, displayTime * 1000);
    
  } catch (err) {
    alert("Pozisyon yüklenemedi!");
  }
}

newPosButton.addEventListener("click", () => {
  if (isPlaying) return;
  resetTimer(secondsText);
  displayPosition();
});

sendPosButton.addEventListener("click", () => {
  if (!isPlaying) return;
  
  const currentFen = board.fen().split(" ")[0];
  const targetFen = lastShownPosition.split(" ")[0];
  
  const isSuccess = currentFen === targetFen;
  isSuccess ? showFeedback("/images/tick.svg") : showFeedback("/images/cross.svg");
});

function showFeedback(imgPath) {
  board.destroy();
  stopTimer();
  
  $("#boardContainer")
    .hide()
    .css({ "background-image": `url(${imgPath})` })
    .fadeIn(400);

  setTimeout(() => {
    $("#boardContainer").fadeOut(300, function () {
      $(this).css({ "background-image": "" });
      board = createBoard("boardContainer", boardConfigs.play);
      $(this).fadeIn(300);
      isPlaying = false;
    });
  }, 2600);
}

// Zorluk Ayarı (Window objesine bağlıyoruz çünkü HTML'den çağrılıyor olabilir)
window.toggleDifficulty = function() {
  difficulty = difficulty === 0 ? 1 : 0;
  const p = document.querySelector("#difficulty p");
  const btn = document.querySelector("#difficulty button");
  
  p.innerHTML = difficulty === 0 ? "Difficulty: Easy" : "Difficulty: Hard";
  btn.innerHTML = difficulty === 0 ? "Increase Difficulty" : "Decrease Difficulty";
};
document.addEventListener("DOMContentLoaded", () => {
//FOR RESPONSIVE BOARD
function updateBoardSize() {
  let containerWidth = Math.min(window.innerWidth * 0.9, 550);
  board.resize(containerWidth);
}

window.addEventListener("load", updateBoardSize);
window.addEventListener("resize", updateBoardSize);

//SELECT HTML ELEMENTS
const newPosButton = document.querySelector("#newPos");
const sendPosButton = document.querySelector("#sendPos");
const secondsText = document.querySelector("#seconds");

//INIT BOARD
let board = Chessboard("boardContainer", {
  draggable: false,
  dropOffBoard: "trash",
  sparePieces: false,
  pieceTheme: "images/fresca/{piece}.svg",
});

//async to not freeze with big fen csvs
async function setRandomFEN() {
  let response = await fetch("oldfens.csv");
  let fenData = await response.text(); // read file as text
  let lines = fenData.trim().split("\n").slice(1);
  //random line
  let randomLine = lines[Math.floor(Math.random() * lines.length)]; // math.random is between 0 and 1
  let fen = randomLine.split(",")[1].trim();
  return fen;
}

let count = 0;
let timerInterval; //variable to hold the interval

function updateCount() {
  secondsText.innerHTML = count;
  count++;
}

function startTimer() {
  if (timerInterval) clearInterval(timerInterval); //Clear any existing timer
  count = 0; //reset the count
  secondsText.innerHTML = count; // update the display
  timerInterval = setInterval(updateCount, 1000);
}

function stopTimer() {
  if (timerInterval) clearInterval(timerInterval);
}

let displayTime = 5;
let isPlaying = false;
let lastShownPosition;

function displayPosition() {
  isPlaying = true;
  //first show position with fen for 10 seconds then kill it and show empty board with sparepieces.
  setRandomFEN().then((fen) => {
    console.log(`displaying the position for ${displayTime} seconds.`); //for debug
    board.position(fen);
    lastShownPosition = fen;
    setTimeout(() => {
      console.log("switch to empty board");
      board.destroy();
      board = Chessboard("boardContainer", {
        draggable: true,
        dropOffBoard: "trash",
        sparePieces: true,
        pieceTheme: "images/fresca/{piece}.svg",
      });
      startTimer(); //start timer when playing
    }, displayTime * 1000);
  });
}

const tick = "images/tick.svg";
const cross = "images/cross.svg";

newPosButton.addEventListener("click", () => {
  if (isPlaying) {
    console.log("isplaying rn");
    return;
  }
  stopTimer(); 
  count = 0;
  secondsText.innerHTML = count;
  displayPosition();
});

sendPosButton.addEventListener("click", () => {
  if (!isPlaying) {
    console.log("notplaying rn");
    return;
  }
  console.log(board.fen());
  console.log(lastShownPosition);
  if (board.fen().split(" ")[0] === lastShownPosition) {
    showFeedback(tick);
  } else {
    showFeedback(cross);
  }
});

function showFeedback(imgPath) {
  console.log(imgPath);

  board.destroy();

  stopTimer();
  $("#boardContainer")
    .hide()
    .css({
      "background-image": "url(" + imgPath + ")",
    })
    .fadeIn(400);

  //after 3sec reinitalize and fade in
  setTimeout(() => {
    $("#boardContainer").fadeOut(300, function () {
      //clear img
      $(this).css({ "background-image": "" });

      board = Chessboard("boardContainer", {
        draggable: true,
        dropOffBoard: "trash",
        sparePieces: true,
        pieceTheme: "images/fresca/{piece}.svg",
      });
      $("#boardContainer").fadeIn(300);
      isPlaying = false;
    
    });
  }, 2600);
}});
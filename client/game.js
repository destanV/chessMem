let difficulty = 0;
let displayTime = 5;
const PORT = 5000;
const API_URL = window.location.hostname === "localhost"
              ||  window.location.hostname === "127.0.0.1"
              ? `http://localhost:${PORT}/api` : "DOMAIN/api"; // DOMAIN ALINCA BURAYI DEGIS
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

  //GET FEN FROM DB AND SET
  async function setRandomFEN() {
    try{
      const url = `${API_URL}/positions/random?difficulty=${difficulty}`;
   const response = await fetch(url);
   if(!response.ok){
    console.log(`url: ${url}`);
    console.log(`WLHname = ${window.location.hostname}`); 
    throw new Error("No response from server");

   }
   const data = await response.json();
   if(data&&data.fen){
    board.position(data.fen);
    console.log(`New FEN loaded: ${data.fen}`);
    return data.fen;

   }
  }
  catch(error){
    console.error("Error ooccured,", error);
    alert("Error while loading position");

  }
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
    
    console.log(`Given FEN: ${board.fen().split(" ")[0]}`);
    console.log(`Got FEN: ${lastShownPosition.split(" ")[0]}`);
    const isSuccess = board.fen().split(" ")[0]===lastShownPosition.split(" ")[0];
    console.log(`isSuccess: ${isSuccess}`);
    isSuccess ? showFeedback(tick) : showFeedback(cross);
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
  }
});
function toggleDifficulty() {
  console.log("toggledifficulty ran");
  console.log("difficulty before change", difficulty);
  if (difficulty === 0) {
    difficulty = 1;
    document.querySelector("#difficulty p").innerHTML = "Difficulty: Hard";
    document.querySelector("#difficulty button").innerHTML =
      "Decrease Difficulty";
  } else if (difficulty === 1) {
    difficulty = 0;
    document.querySelector("#difficulty p").innerHTML = "Difficulty: Easy";
    document.querySelector("#difficulty button").innerHTML =
      "Increase Difficulty";
  }
}

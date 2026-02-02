let count = 0;
let timerInterval;

export function startTimer(displayElement) {
  if (timerInterval) clearInterval(timerInterval);
  count = 0;
  displayElement.innerHTML = count;
  timerInterval = setInterval(() => {
    count++;
    displayElement.innerHTML = count;
  }, 1000);
}

export function stopTimer() {
  clearInterval(timerInterval);
}

export function resetTimer(displayElement) {
  stopTimer();
  count = 0;
  displayElement.innerHTML = count;
}
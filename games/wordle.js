let currentWord = "APPLE";
let currentRow = 0;
let currentCol = 0;
const maxGuesses = 6;
let gameWon = false;
let currentGuess = "";
let keyboardState = {};

const keyboard = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "⌫"],
];

let words = []; // single list for both picking and validation

// Fetch the words.json file
fetch("./assets/words.json")
  .then((res) => res.json())
  .then((data) => {
    words = data.map((w) => w.toUpperCase());
    pickRandomWord(); // pick the initial random word
  });

// Pick a random word from the list
function pickRandomWord() {
  currentWord = words[Math.floor(Math.random() * words.length)];
}

// Validate a guess
function isValidWord(word) {
  return words.includes(word.toUpperCase());
}

function initWordleBoard() {
  const board = document.getElementById("wordle-board");
  board.innerHTML = "";

  for (let i = 0; i < maxGuesses; i++) {
    const row = document.createElement("div");
    row.className = "wordle-row";
    row.setAttribute("data-row", i);

    for (let j = 0; j < 5; j++) {
      const letter = document.createElement("div");
      letter.className = "wordle-letter";
      letter.setAttribute("data-col", j);
      row.appendChild(letter);
    }

    board.appendChild(row);
  }
}

function initKeyboard() {
  const keyboardEl = document.getElementById("keyboard");
  keyboardEl.innerHTML = "";

  keyboard.forEach((row) => {
    const rowEl = document.createElement("div");
    rowEl.className = "keyboard-row";

    row.forEach((key) => {
      const keyEl = document.createElement("button");
      keyEl.className = "key";
      keyEl.textContent = key;
      keyEl.setAttribute("data-key", key);

      if (key === "ENTER") {
        keyEl.classList.add("wide");
      }

      keyEl.onclick = () => handleKeyClick(key);
      rowEl.appendChild(keyEl);
    });

    keyboardEl.appendChild(rowEl);
  });
}

function handleKeyPress(e) {
  if (!document.getElementById("wordle-modal").classList.contains("active"))
    return;
  if (gameWon || currentRow >= maxGuesses) return;

  const key = e.key.toUpperCase();

  if (key === "ENTER") handleKeyClick("ENTER");
  else if (key === "BACKSPACE") handleKeyClick("⌫");
  else if (/^[A-Z]$/.test(key)) handleKeyClick(key);
}

function handleKeyClick(key) {
  if (gameWon || currentRow >= maxGuesses) return;

  if (key === "ENTER") submitGuess();
  else if (key === "⌫") {
    if (currentCol > 0) {
      currentCol--;
      currentGuess = currentGuess.slice(0, -1);
      updateCurrentRow();
    }
  } else if (currentCol < 5) {
    currentGuess += key;
    currentCol++;
    updateCurrentRow();
  }
}

function updateCurrentRow() {
  const row = document.querySelector(`[data-row="${currentRow}"]`);
  const letters = row.querySelectorAll(".wordle-letter");

  for (let i = 0; i < 5; i++) {
    if (i < currentGuess.length) {
      letters[i].textContent = currentGuess[i];
      letters[i].classList.add("filled");
    } else {
      letters[i].textContent = "";
      letters[i].classList.remove("filled");
    }
  }
}

async function submitGuess() {
  if (currentGuess.length !== 5) {
    document.getElementById("wordle-message").textContent = "Not enough letters!";
    setTimeout(() => {
      document.getElementById("wordle-message").textContent = "";
    }, 1000);
    return;
  }

  if (!isValidWord(currentGuess)) {
    document.getElementById("wordle-message").textContent = "Not in word list!";
    setTimeout(() => {
      document.getElementById("wordle-message").textContent = "";
    }, 1000);
    return;
  }

  document.getElementById("wordle-message").textContent = "";

  const guess = currentGuess;
  const row = document.querySelector(`[data-row="${currentRow}"]`);
  const letters = row.querySelectorAll(".wordle-letter");
  const letterCount = {};
  const guessStatus = Array(5).fill("absent");

  for (let char of currentWord) letterCount[char] = (letterCount[char] || 0) + 1;

  for (let i = 0; i < 5; i++) {
    if (guess[i] === currentWord[i]) {
      guessStatus[i] = "correct";
      letterCount[guess[i]]--;
    }
  }

  for (let i = 0; i < 5; i++) {
    if (guessStatus[i] === "absent" && currentWord.includes(guess[i]) && letterCount[guess[i]] > 0) {
      guessStatus[i] = "present";
      letterCount[guess[i]]--;
    }
  }

  guessStatus.forEach((status, i) => {
    setTimeout(() => {
      letters[i].classList.add(status);
      updateKeyboardKey(guess[i], status);
    }, i * 200);
  });

  if (guess === currentWord) {
    gameWon = true;
    setTimeout(() => {
      document.getElementById("wordle-message").textContent = "🎉 You won!";
      setTimeout(() => {
        closeWordleModal();
        revealTile(document.querySelector('[data-tile-index="3"]'));
        resetWordleGame();
      }, 1500);
    }, 1200);
  } else {
    currentRow++;
    currentCol = 0;
    currentGuess = "";

    if (currentRow >= maxGuesses) {
      document.getElementById("wordle-message").textContent = `Game Over! Word was ${currentWord}`;
      setTimeout(() => {
        pickRandomWord();
        resetWordleGame();
        document.getElementById("wordle-message").textContent = "";
      }, 2000);
    }
  }
}

function updateKeyboardKey(letter, status) {
  const keyEl = document.querySelector(`.key[data-key="${letter}"]`);
  if (!keyEl) return;

  const currentStatus = keyboardState[letter];
  if (
    status === "correct" ||
    (status === "present" && currentStatus !== "correct") ||
    (status === "absent" && !currentStatus)
  ) {
    keyboardState[letter] = status;
    keyEl.classList.remove("correct", "present", "absent");
    keyEl.classList.add(status);
  }
}

function openWordleModal() {
  document.getElementById("wordle-modal").classList.add("active");
}

function closeWordleModal() {
  document.getElementById("wordle-modal").classList.remove("active");
}

function resetWordleGame() {
  currentRow = 0;
  currentCol = 0;
  gameWon = false;
  currentGuess = "";
  keyboardState = {};
  document.getElementById("wordle-message").textContent = "";
  initWordleBoard();
  initKeyboard();
}

const rebusImages = [
  { src: "./assets/rebus-puzzle-1.png", answer: "forgive and forget" },
  { src: "./assets/rebus-puzzle-2.png", answer: "head over heels" },
  { src: "./assets/rebus-puzzle-3.png", answer: "crossbow" },
  { src: "./assets/rebus-puzzle-4.png", answer: "address" },
  // { src: "./assets/rebus-puzzle-5.png", answer: "potatoes" },
];

let currentRebusIndex = 0;
let rebusGameWon = false;

function openRebusModal() {
  currentRebusIndex = 0;
  rebusGameWon = false;
  document.getElementById("rebus-modal").classList.add("active");
  loadRebusQuestion();
  document.getElementById("rebus-input").focus();
}

function closeRebusModal() {
  document.getElementById("rebus-modal").classList.remove("active");
}

function loadRebusQuestion() {
  const question = rebusImages[currentRebusIndex];
  document.getElementById("rebus-image").src = question.src;
  document.getElementById("rebus-input").value = "";
  document.getElementById("rebus-message").textContent = "";
  document.getElementById(
    "rebus-progress"
  ).textContent = `Question ${currentRebusIndex + 1} of ${rebusImages.length}`;
}

function submitRebusGuess() {
  if (rebusGameWon) return;

  const input = document.getElementById("rebus-input");
  const guess = input.value.trim().toLowerCase();
  const question = rebusImages[currentRebusIndex];

  if (!guess) {
    document.getElementById("rebus-message").textContent =
      "Please enter an answer!";
    return;
  }

  if (guess === question.answer.toLowerCase()) {
    document.getElementById("rebus-message").textContent = "✅ Correct!";
    document.getElementById("rebus-message").style.color = "#6aaa64";

    setTimeout(() => {
      currentRebusIndex++;

      if (currentRebusIndex >= rebusImages.length) {
        rebusGameWon = true;
        document.getElementById("rebus-message").textContent =
          "🎉 You completed all puzzles!";
        setTimeout(() => {
          closeRebusModal();
          revealTile(document.querySelector('[data-tile-index="5"]'));
        }, 1500);
      } else {
        loadRebusQuestion();
      }
    }, 1000);
  } else {
    document.getElementById("rebus-message").textContent = "❌ Try again!";
    document.getElementById("rebus-message").style.color = "#d32f2f";
    input.value = "";
  }
}
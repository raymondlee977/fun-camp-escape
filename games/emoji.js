// Emoji game state
const emojiQuestions = [
  { emoji: "🛏️👌🏻", answer: "bedok" },
  {
    emoji: "⛵🏢🏢🏢",
    answer: "marina bay sands",
  },
  {
    emoji: "🐯🧴🔥",
    answer: "tiger balm",
  },
  {
    emoji: "👴🏻✈️",
    answer: "old chang kee",
  },
];
let currentEmojiQuestion = 0;
let emojiGameWon = false;



// Emoji Game Functions
function openEmojiModal() {
  currentEmojiQuestion = 0;
  emojiGameWon = false;
  document.getElementById("emoji-modal").classList.add("active");
  loadEmojiQuestion();
  document.getElementById("emoji-input").focus();
}

function closeEmojiModal() {
  document.getElementById("emoji-modal").classList.remove("active");
}

function loadEmojiQuestion() {
  const question = emojiQuestions[currentEmojiQuestion];
  document.getElementById("emoji-display").textContent = question.emoji;
  document.getElementById("emoji-input").value = "";
  document.getElementById("emoji-message").textContent = "";
  document.getElementById("emoji-progress").textContent = `Question ${
    currentEmojiQuestion + 1
  } of ${emojiQuestions.length}`;
}

function submitEmojiGuess() {
  if (emojiGameWon) return;

  const input = document.getElementById("emoji-input");
  const guess = input.value.trim().toLowerCase();
  const question = emojiQuestions[currentEmojiQuestion];

  if (!guess) {
    document.getElementById("emoji-message").textContent =
      "Please enter an answer!";
    return;
  }

  if (guess === question.answer.toLowerCase()) {
    document.getElementById("emoji-message").textContent = "✅ Correct!";
    document.getElementById("emoji-message").style.color = "#6aaa64";

    setTimeout(() => {
      currentEmojiQuestion++;

      if (currentEmojiQuestion >= emojiQuestions.length) {
        emojiGameWon = true;
        document.getElementById("emoji-message").textContent =
          "🎉 You completed all questions!";
        setTimeout(() => {
          closeEmojiModal();
          revealTile(document.querySelector('[data-tile-index="4"]'));
        }, 1500);
      } else {
        loadEmojiQuestion();
      }
    }, 1000);
  } else {
    document.getElementById("emoji-message").textContent =
      "❌ Try again!";
    document.getElementById("emoji-message").style.color = "#d32f2f";
    input.value = "";
  }
}
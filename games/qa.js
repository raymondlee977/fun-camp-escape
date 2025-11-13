 const tileQuestions = [
  {
    tileIndex: 0,
    title: "Checkpoint 3",
    question: "Where is Gru?",
    answer: "hillgrove",
    requiresPrevious: 1,
  },
  {
    tileIndex: 1,
    title: "Checkpoint 2",
    question: "Why did Agnes capture Gru?",
    answer: "torn pony",
    requiresPrevious: 2,
  },
  {
    tileIndex: 2,
    title: "Checkpoint 1",
    question: "Who captured Gru?",
    answer: "agnes",
    requiresPrevious: null,
  },
  {
    tileIndex: 6,
    title: "Riddle 1",
    question:
      "I roar with pride but never bite,\nby the bay, I greet day and night.\nAn icon cast in stone unbroken,\nwith every photo taken, mouth wide open.",
    answer: "merlion",
    requiresPrevious: null,
  },
  {
    tileIndex: 7,
    title: "Riddle 2",
    question: "I shape your day in tidy rows,\nwhere time is sliced and learning flows.\nThe bell and I, a steady pair,\nwe hold your time with measured care.",
    answer: "timetable",
    requiresPrevious: null,
  },
  {
    tileIndex: 8,
    title: "Riddle 3",
    question: "I speak no words, yet guard my space,\na quiet boss in mealtime race.\nThe rule’s unspoken,\nyet all obey — the sign unbroken.",
    answer: "tissue",
    requiresPrevious: null,
  },
];
let currentQATile = null;

function openQAModal(questionObj) {
  currentQATile = questionObj;
  document.getElementById("qa-title").textContent = questionObj.title;
  document.getElementById("qa-question").textContent =
    questionObj.question;
  document.getElementById("qa-input").value = "";
  document.getElementById("qa-message").textContent = "";
  document.getElementById("qa-modal").classList.add("active");
  document.getElementById("qa-input").focus();
}

function closeQAModal() {
  document.getElementById("qa-modal").classList.remove("active");
}

function submitQAAnswer() {
  const inputAnswer = document
    .getElementById("qa-input")
    .value.trim()
    .toLowerCase();
  const msg = document.getElementById("qa-message");

  if (!inputAnswer) {
    msg.textContent = "Please enter an answer!";
    msg.style.color = "#d32f2f";
    return;
  }

  if (inputAnswer === currentQATile.answer.toLowerCase()) {
    msg.textContent = "✅ Correct!";
    msg.style.color = "#6aaa64";

    setTimeout(() => {
      closeQAModal();
      revealTile(
        document.querySelector(
          `[data-tile-index="${currentQATile.tileIndex}"]`
        )
      );
    }, 1000);
  } else {
    msg.textContent = "❌ Try again!";
    msg.style.color = "#d32f2f";
    document.getElementById("qa-input").value = "";
  }
}

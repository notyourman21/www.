
/* =========================================
   1. SUNSET CLOUD ANIMATION
========================================= */

const canvas = document.getElementById("cloudCanvas") ||
  document.createElement("canvas");

canvas.id = "cloudCanvas";

if (!canvas.parentElement) {
  document.body.prepend(canvas);
}

const ctx = canvas.getContext("2d");

let w, h;
let frame = 0;
let time = 0;
let imageData;

function resize() {
  const scale = 0.35;

  w = Math.max(1, Math.floor(window.innerWidth * scale));
  h = Math.max(1, Math.floor(window.innerHeight * scale));

  canvas.width = w;
  canvas.height = h;

  imageData = ctx.createImageData(w, h);
}

function noise(x, y) {
  const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return n - Math.floor(n);
}

function smoothNoise(x, y) {
  const ix = Math.floor(x);
  const iy = Math.floor(y);

  const fx = x - ix;
  const fy = y - iy;

  const sx = fx * fx * (3 - 2 * fx);
  const sy = fy * fy * (3 - 2 * fy);

  const a = noise(ix, iy);
  const b = noise(ix + 1, iy);
  const c = noise(ix, iy + 1);
  const d = noise(ix + 1, iy + 1);

  const top = a + (b - a) * sx;
  const bottom = c + (d - c) * sx;

  return top + (bottom - top) * sy;
}

function fbm(x, y) {
  let value = 0;
  let amplitude = 0.5;

  for (let i = 0; i < 4; i++) {
    value += smoothNoise(x, y) * amplitude;

    x *= 2;
    y *= 2;
    amplitude *= 0.5;
  }

  return value;
}

function renderClouds() {
  const data = imageData.data;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const nx = x / w;
      const ny = y / h;

      const drift = time;

      const warp = fbm(nx * 3 + drift, ny * 5);

      const shape = fbm(
        nx * 4 + drift * 0.8 + warp * 0.8,
        ny * 9 + warp * 0.3
      );

      const detail = fbm(
        nx * 11 - drift * 0.5,
        ny * 17
      );

      const density = shape * 0.78 + detail * 0.22;

      let alpha = (density - 0.48) * 4.2;

      alpha = Math.max(0, Math.min(1, alpha));

      const heightFade = Math.min(1, ny * 2.5 + 0.15);

      alpha *= heightFade;

      const i = (y * w + x) * 4;

      // Warm sunset peach-orange cloud colour
      data[i] = 255;
      data[i + 1] = 175 + detail * 45;
      data[i + 2] = 150 + detail * 45;

      // Important: cloud transparency
      data[i + 3] = alpha * 190;
    }
  }

  ctx.putImageData(imageData, 0, 0);
}

function animate() {
  frame++;

  if (frame % 2 === 0) {
    time += 0.028;
    renderClouds();
  }

  requestAnimationFrame(animate);
}

resize();
renderClouds();

window.addEventListener("resize", () => {
  resize();
  renderClouds();
});

animate();


// =========================================
// 2. MAIN HTML ELEMENTS
// =========================================

const continueBtn = document.getElementById("continueBtn");
const welcomeSection = document.querySelector(".welcome-section");
const secondScene = document.getElementById("secondScene");
const personName = document.getElementById("personName");

const questionText = document.getElementById("questionText");
const questionNumber = document.querySelector(".question-number");

const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");

const percentageGame = document.getElementById("percentageGame");
const percentageInput = document.getElementById("percentageInput");
const submitGuess = document.getElementById("submitGuess");
const randomGuess = document.getElementById("randomGuess");

const questionThree = document.getElementById("questionThree");
const optionA = document.getElementById("optionA");
const optionB = document.getElementById("optionB");

const finalQuestion = document.getElementById("finalQuestion");
const loveYes = document.getElementById("loveYes");
const loveNo = document.getElementById("loveNo");

let specialName = "";
let currentStep = "question1";


// =========================================
// 3. START WEBSITE
// =========================================

continueBtn.addEventListener("click", () => {
  if (!personName.value.trim()) {
    personName.focus();
    return;
  }

  specialName = personName.value.trim();

  continueBtn.classList.remove("clicked");

  void continueBtn.offsetWidth;

  continueBtn.classList.add("clicked");

  setTimeout(() => {
    welcomeSection.style.transition =
      "opacity 0.5s ease, transform 0.5s ease";

    welcomeSection.style.opacity = "0";
    welcomeSection.style.transform = "translateY(-20px)";

    secondScene.classList.add("show");
  }, 500);
});


// =========================================
// 4. COMMON REPLY
// =========================================

function showReply(message, nextStep) {
  currentStep = nextStep;

  questionText.textContent = message;
  questionNumber.textContent = "A LITTLE SOMETHING FOR YOU ❤️";

  questionText.style.display = "block";
  questionNumber.style.display = "block";

  yesBtn.style.display = "none";

  noBtn.style.display = "block";
  noBtn.textContent = "Continue →";

  percentageGame.classList.remove("show");
  questionThree.classList.remove("show");
  finalQuestion.classList.remove("show");
}


// =========================================
// 5. QUESTION ONE
// =========================================

yesBtn.addEventListener("click", () => {
  showReply(
    `Oh really, ${specialName}? Someone seems pretty confident! 😂❤️`,
    "toPercentage"
  );
});

noBtn.addEventListener("click", () => {
  if (currentStep === "question1") {
    showReply(
      `Haha, ${specialName}! I knew you had no idea how special you are to me! ❤️`,
      "toPercentage"
    );

  } else if (currentStep === "toPercentage") {
    showPercentageQuestion();

  } else if (currentStep === "toQuestion3") {
    showQuestion3();

  } else if (currentStep === "toFinal") {
    showFinalQuestion();
  }
});


// =========================================
// 6. QUESTION TWO - PERCENTAGE GAME
// =========================================

function showPercentageQuestion() {
  currentStep = "percentage";

  questionNumber.textContent = "QUESTION 02 · 🎲";

  questionText.textContent =
    `Alright, ${specialName}… how special do you think you are to me? Guess the percentage!`;

  questionText.style.display = "block";
  questionNumber.style.display = "block";

  yesBtn.style.display = "none";
  noBtn.style.display = "none";

  percentageInput.value = "";

  percentageGame.classList.add("show");
}


// Random percentage

randomGuess.addEventListener("click", () => {
  percentageInput.value = Math.floor(Math.random() * 101);
});


// Submit percentage

submitGuess.addEventListener("click", () => {
  const guess = Number(percentageInput.value);

  if (percentageInput.value.trim() === "" || guess < 0 || guess > 100) {
    showReply("Please enter a number between 0 and 100! ❤️", "toQuestion3");
    return;
  }

  if (guess === 99) {
    showReply("Awww, 99%? You left 1% for me to prove! 🙈❤️", "toQuestion3");
  } else if (guess === 100) {
    showReply("100%? Someone's being extra confident! 😂❤️", "toQuestion3");
  } else {
    showReply("Not quite! But I love your confidence! 🥰❤️", "toQuestion3");
  }
});


// =========================================
// 7. QUESTION THREE
// =========================================

function showQuestion3() {
  currentStep = "question3";

  questionNumber.textContent = "QUESTION 03 · ❤️";

  questionText.textContent =
    `What if I told you, ${specialName}, that someone secretly smiles every time your name appears on their screen… would you guess who?`;

  questionText.style.display = "block";
  questionNumber.style.display = "block";

  percentageGame.classList.remove("show");

  yesBtn.style.display = "none";
  noBtn.style.display = "none";

  questionThree.classList.add("show");
}


// Option A

optionA.addEventListener("click", () => {
  showReply(
    `Awww, ${specialName}! Someone caught me smiling! 🥹❤️ But how did you figure that out so quickly?`,
    "toFinal"
  );
});


// Option B

optionB.addEventListener("click", () => {
  showReply(
    `${specialName}, someone else? Ouch! 😂 I guess I need to make it more obvious that it's you! ❤️`,
    "toFinal"
  );
});


// =========================================
// 8. FINAL QUESTION
// =========================================

function showFinalQuestion() {
  currentStep = "final";

  questionText.style.display = "none";
  questionNumber.style.display = "none";

  questionThree.classList.remove("show");
  percentageGame.classList.remove("show");

  finalQuestion.classList.add("show");

  finalQuestion.querySelector("h2").textContent =
    `Do you love me, ${specialName}? 🥺`;

  yesBtn.style.display = "none";
  noBtn.style.display = "none";

  loveYes.style.display = "block";
  loveNo.style.display = "block";

  // Reset runaway button position
  loveNo.style.position = "";
  loveNo.style.left = "";
  loveNo.style.top = "";
}


// =========================================
// 9. FINAL - YES BUTTON
// =========================================

loveYes.addEventListener("click", () => {
  const finalHeading = finalQuestion.querySelector("h2");

  finalHeading.textContent =
    `I love you too, ${specialName}! ❤️ You make my world a little more beautiful every day. 🥹`;

  loveYes.style.display = "none";
  loveNo.style.display = "none";
});


// =========================================
// 10. FINAL - NO BUTTON RUNS AWAY
// =========================================

function moveNoButton() {
  const maxX = Math.max(
    0,
    window.innerWidth - loveNo.offsetWidth - 20
  );

  const maxY = Math.max(
    0,
    window.innerHeight - loveNo.offsetHeight - 20
  );

  loveNo.style.position = "fixed";

  loveNo.style.left =
    Math.floor(Math.random() * maxX) + "px";

  loveNo.style.top =
    Math.floor(Math.random() * maxY) + "px";
}

loveNo.addEventListener("mouseenter", moveNoButton);

loveNo.addEventListener("touchstart", (event) => {
  event.preventDefault();
  moveNoButton();
});

loveNo.addEventListener("click", (event) => {
  event.preventDefault();
  moveNoButton();
});

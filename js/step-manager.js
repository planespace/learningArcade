// js/step-manager.js

function goToStep(stepNum) {
  document
    .querySelectorAll(".step")
    .forEach((s) => s.classList.remove("active"));
  const nextStep = document.querySelector(`.step[data-step="${stepNum}"]`);
  if (nextStep) {
    nextStep.classList.add("active");
    CONFIG.step = stepNum;
    updateDots();
    saveState();
  }
  // Initialize survey when step 5 is shown (only once)
  if (stepNum === 5 && !window._surveyInit) {
    window._surveyInit = true;
    if (typeof initSurvey === "function") {
      initSurvey();
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initWelcome();
  initModule1();
  initModule2();
  initModule3();
  initSynthesis();

  goToStep(CONFIG.step);

  if (CONFIG.step === 0) {
    document.getElementById("startBtn").addEventListener("click", () => {
      goToStep(1);
    });
  }

  document.getElementById("xpValue").textContent = CONFIG.xp;

  document.getElementById("restartBtn").addEventListener("click", () => {
    localStorage.removeItem("learningArcadeState");
    localStorage.removeItem("learningArcadeAnalytics");
    location.reload();
  });
});

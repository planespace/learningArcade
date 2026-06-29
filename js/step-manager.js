// js/step-manager.js
let hasTrackerStarted = false;

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

    // ★ start tracking on first step change
    if (!hasTrackerStarted) {
      hasTrackerStarted = true;
      trackStepEnter(0); // initial step
    }
    trackStepEnter(stepNum);
  }

  // Show/hide skip button: only visible in steps 1–4
  const skipBtn = document.getElementById("skipToSurveyBtn");
  if (skipBtn) {
    skipBtn.style.display =
      stepNum >= 1 && stepNum <= 4 ? "inline-flex" : "none";
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

  // Go to saved step
  goToStep(CONFIG.step);

  if (CONFIG.step === 0) {
    document.getElementById("startBtn").addEventListener("click", () => {
      goToStep(1);
    });
  }

  // Mute button
  document
    .getElementById("muteBtn")
    .addEventListener("click", audio.toggleMute);

  // Skip button
  const skipBtn = document.getElementById("skipToSurveyBtn");
  skipBtn.addEventListener("click", () => {
    trackSkip(CONFIG.step, currentPhase || 0);
    goToStep(5);
  });

  document.getElementById("xpValue").textContent = CONFIG.xp;

  // Restart
  document.getElementById("restartBtn").addEventListener("click", () => {
    localStorage.removeItem("learningArcadeState");
    localStorage.removeItem("learningArcadeAnalytics");
    location.reload();
  });
});

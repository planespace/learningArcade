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

    // track the step-level event
    if (!hasTrackerStarted) {
      hasTrackerStarted = true;
      trackPhaseEnter(0, 0); // welcome page as phase 0 of step 0
    }
    trackPhaseEnter(stepNum, 0); // phase 0 when entering a new step (will be overwritten by module phases)
  }

  // show/hide skip button: visible only in steps 1‑4
  const skipBtn = document.getElementById("skipToSurveyBtn");
  if (skipBtn) {
    skipBtn.style.display =
      stepNum >= 1 && stepNum <= 4 ? "inline-flex" : "none";
  }

  // initialise survey when step 5 is shown
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

  // mute button
  document
    .getElementById("muteBtn")
    .addEventListener("click", audio.toggleMute);

  // skip button
  const skipBtn = document.getElementById("skipToSurveyBtn");
  skipBtn.addEventListener("click", () => {
    // track the skip with current step and current phase (0 by default)
    trackSkip(CONFIG.step, currentPhase || 0);
    goToStep(5);
  });

  document.getElementById("xpValue").textContent = CONFIG.xp;

  document.getElementById("restartBtn").addEventListener("click", () => {
    localStorage.removeItem("learningArcadeState");
    localStorage.removeItem("learningArcadeAnalytics");
    location.reload();
  });
});

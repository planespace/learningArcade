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
      trackPhaseEnter(0, 0);
    }
    trackPhaseEnter(stepNum, 0);
  }

  // show/hide skip button (appears after Module 1 is done, i.e. step 2–4)
  const skipBtn = document.getElementById("skipToSurveyBtn");
  if (skipBtn) {
    const showSkip = CONFIG.modules.m1 && stepNum >= 2 && stepNum <= 4;
    skipBtn.style.display = showSkip ? "inline-flex" : "none";
  }

  // show/hide home button (visible everywhere except welcome page)
  const homeBtn = document.getElementById("homeBtn");
  if (homeBtn) {
    homeBtn.style.display = stepNum === 0 ? "none" : "inline-block";
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
  initModule5();
  goToStep(CONFIG.step);

  // Subject selection buttons – always attach (they live in the welcome DOM)
  const startPhysics = document.getElementById("startPhysics");
  const startChemistry = document.getElementById("startChemistry");
  if (startPhysics) {
    startPhysics.addEventListener("click", () => goToStep(1));
  }
  if (startChemistry) {
    startChemistry.addEventListener("click", () => goToStep(8));
  }

  // Home button
  document.getElementById("homeBtn").addEventListener("click", () => {
    // Reset tracker to avoid stale history
    hasTrackerStarted = false;
    goToStep(0);
  });

  // Mute button
  document
    .getElementById("muteBtn")
    .addEventListener("click", audio.toggleMute);
  const skipBtn = document.getElementById("skipToSurveyBtn");
  skipBtn.addEventListener("click", () => {
    Swal.fire({
      title: "Skip to feedback?",
      html: `
      <p style="color:#fff; font-size:1rem; margin-bottom:0.5rem;">
        You'll skip the rest of the learning activities and go straight to a quick feedback section.
      </p>
      <p style="color:var(--teal); font-size:0.95rem;">
        It only takes a couple of minutes — your honest thoughts help a lot.
      </p>
    `,
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#00d2ff",
      cancelButtonColor: "#e74c3c",
      confirmButtonText: "Yes, go to feedback",
      cancelButtonText: "Stay and continue",
      background: "#0f0f23",
      color: "#fff",
      customClass: {
        popup: "swal-popup",
        title: "swal-title",
        htmlContainer: "swal-html",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        trackSkip(CONFIG.step, currentPhase || 0);
        goToStep(5);
      }
    });
  });
  document.getElementById("xpValue").textContent = CONFIG.xp;

  // Restart button
  document.getElementById("restartBtn").addEventListener("click", () => {
    localStorage.removeItem("learningArcadeState");
    localStorage.removeItem("learningArcadeAnalytics");
    location.reload();
  });
});

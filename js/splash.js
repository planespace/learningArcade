// js/splash.js
(function () {
  const overlay = document.getElementById("splashOverlay");
  const startBtn = document.getElementById("splashStartBtn");

  function hideSplash() {
    overlay.style.opacity = "0";
    overlay.style.visibility = "hidden";
  }

  // If the user already started (step > 0), skip the splash entirely
  if (CONFIG.step > 0) {
    hideSplash();
    if (typeof goToStep === "function") {
      goToStep(CONFIG.step);
    }
    return;
  }

  // Otherwise, show the splash and wait for a click
  startBtn.addEventListener("click", () => {
    hideSplash();
    if (typeof goToStep === "function") {
      goToStep(0);
    }
  });
})();

// js/config.js

// Load saved state from localStorage (or use defaults)
const saved = JSON.parse(localStorage.getItem("learningArcadeState")) || {};

const CONFIG = {
  xp: saved.xp || 0,
  step: saved.step || 0,
  modules: saved.modules || {
    m1: false,
    m2: false,
    m3: false,
    synthesis: false,
  },
  // track which chemistry sub‑step the user is on
  chemistryStep: saved.chemistryStep || "c-step0-1",
};

// Save state to localStorage whenever anything changes
function saveState() {
  localStorage.setItem(
    "learningArcadeState",
    JSON.stringify({
      xp: CONFIG.xp,
      step: CONFIG.step,
      modules: CONFIG.modules,
      chemistryStep: CONFIG.chemistryStep,
    })
  );
}

function addXP(amount) {
  CONFIG.xp += amount;
  document.getElementById("xpValue").textContent = CONFIG.xp;
  saveState();
}

function markModuleDone(module) {
  CONFIG.modules[module] = true;
  saveState();
}

function updateDots() {
  const dots = document.querySelectorAll(".dot");
  dots.forEach((dot, i) => {
    dot.classList.toggle("active", i <= CONFIG.step);
  });
  // Update XP display to match restored state
  document.getElementById("xpValue").textContent = CONFIG.xp;
}

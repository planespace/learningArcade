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
};

// Save state to localStorage whenever anything changes
function saveState() {
  localStorage.setItem(
    "learningArcadeState",
    JSON.stringify({
      xp: CONFIG.xp,
      step: CONFIG.step,
      modules: CONFIG.modules,
    })
  );
}

function addXP(amount) {
  CONFIG.xp += amount;
  document.getElementById("xpValue").textContent = CONFIG.xp;
  saveState(); // ← save after XP change
}

function markModuleDone(module) {
  CONFIG.modules[module] = true;
  saveState(); // ← save after module completion
}

function updateDots() {
  const dots = document.querySelectorAll(".dot");
  dots.forEach((dot, i) => {
    dot.classList.toggle("active", i <= CONFIG.step);
  });
  // Update XP display to match restored state
  document.getElementById("xpValue").textContent = CONFIG.xp;
}

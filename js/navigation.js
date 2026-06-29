// js/navigation.js (debug version)
const phaseHistory = [];
const phaseRegistries = {};

function pushPhase(num) {
  console.log("⬆ pushPhase", num, "history before:", [...phaseHistory]);
  const idx = phaseHistory.indexOf(num);
  if (idx !== -1) phaseHistory.splice(idx);
  phaseHistory.push(num);
  console.log("⬆ history after:", [...phaseHistory]);
}

function popPhase() {
  console.log("⬇ popPhase called, history:", [...phaseHistory]);
  if (phaseHistory.length > 1) {
    phaseHistory.pop();
    const prev = phaseHistory[phaseHistory.length - 1];
    console.log("⬇ returning previous phase:", prev);
    return prev;
  }
  console.log("⬇ cannot pop – history too short");
  return null;
}

function registerPhaseHandler(step, showPhaseFn) {
  console.log("📋 registered handler for step", step);
  phaseRegistries[step] = showPhaseFn;
}

function updateBackBtnVisibility() {
  const btn = document.getElementById("backBtn");
  if (!btn) return;
  const shouldShow =
    CONFIG.step > 0 && CONFIG.step < 5 && phaseHistory.length > 1;
  console.log(
    "👁 updateBackBtnVisibility – step:",
    CONFIG.step,
    "history len:",
    phaseHistory.length,
    "→ show:",
    shouldShow
  );
  btn.style.display = shouldShow ? "flex" : "none";
}

// js/haptics.js
const haptics = {
  correct() {
    if (navigator.vibrate) navigator.vibrate(15);
    // animation is added by the caller, not here
  },
  wrong() {
    if (navigator.vibrate) navigator.vibrate([10, 50, 10]);
  },
  // helper to apply the pulse/shake animation
  applyAnimation(el, type) {
    if (!el) return;
    const cls = type === "correct" ? "pulse-correct" : "shake-wrong";
    el.classList.add(cls);
    setTimeout(() => el.classList.remove(cls), 400);
  },
};

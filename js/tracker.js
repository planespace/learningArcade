// js/tracker.js
const sessionId =
  Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
const stepEnterTimes = {};
let currentStep = null;
let currentPhase = null;

function trackPhaseEnter(step, phase) {
  // exit previous phase if any
  if (currentStep !== null && currentPhase !== null) {
    const key = `${currentStep}-${currentPhase}`;
    if (stepEnterTimes[key]) {
      const duration = Math.round((Date.now() - stepEnterTimes[key]) / 1000);
      sendEvent({
        sessionId,
        step: currentStep,
        phase: currentPhase,
        action: "exit",
        duration,
        timestamp: new Date().toISOString(),
      });
    }
  }

  // enter new phase
  currentStep = step;
  currentPhase = phase;
  const key = `${step}-${phase}`;
  stepEnterTimes[key] = Date.now();
  sendEvent({
    sessionId,
    step,
    phase,
    action: "enter",
    duration: 0,
    timestamp: new Date().toISOString(),
  });
}

function trackSkip(step, phase) {
  sendEvent({
    sessionId,
    step,
    phase,
    action: "skip",
    duration: 0,
    timestamp: new Date().toISOString(),
  });
}

function sendEvent(payload) {
  if (
    window.location.hostname === "127.0.0.1" ||
    window.location.hostname === "localhost"
  ) {
    console.log("📋 Event (local):", payload);
    return;
  }
  fetch("/api/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).catch((err) => console.error("Event send failed:", err));
}

// Track page close
window.addEventListener("beforeunload", () => {
  if (currentStep !== null && currentPhase !== null) {
    const key = `${currentStep}-${currentPhase}`;
    if (stepEnterTimes[key]) {
      const duration = Math.round((Date.now() - stepEnterTimes[key]) / 1000);
      const blob = new Blob(
        [
          JSON.stringify({
            sessionId,
            step: currentStep,
            phase: currentPhase,
            action: "exit",
            duration,
            timestamp: new Date().toISOString(),
          }),
        ],
        { type: "application/json" }
      );
      navigator.sendBeacon("/api/events", blob);
    }
  }
});

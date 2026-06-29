// js/tracker.js
const sessionId =
  Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
const stepEnterTimes = {};
let currentStep = null;

function trackStepEnter(step) {
  // record exit for previous step
  if (currentStep !== null && stepEnterTimes[currentStep]) {
    const duration = Math.round(
      (Date.now() - stepEnterTimes[currentStep]) / 1000
    );
    sendEvent({
      sessionId,
      step: currentStep,
      action: "exit",
      duration,
      timestamp: new Date().toISOString(),
    });
  }
  // record enter for new step
  stepEnterTimes[step] = Date.now();
  currentStep = step;
  sendEvent({
    sessionId,
    step,
    action: "enter",
    duration: 0,
    timestamp: new Date().toISOString(),
  });
}

function trackSkip(step) {
  sendEvent({
    sessionId,
    step,
    action: "skip",
    duration: 0,
    timestamp: new Date().toISOString(),
  });
}

function sendEvent(payload) {
  // Don't send on localhost (development)
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
  if (currentStep !== null && stepEnterTimes[currentStep]) {
    const duration = Math.round(
      (Date.now() - stepEnterTimes[currentStep]) / 1000
    );
    // use sendBeacon for reliability
    const blob = new Blob(
      [
        JSON.stringify({
          sessionId,
          step: currentStep,
          action: "exit",
          duration,
          timestamp: new Date().toISOString(),
        }),
      ],
      { type: "application/json" }
    );
    navigator.sendBeacon("/api/events", blob);
  }
});

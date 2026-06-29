// js/audio.js
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx;
let muted = false;

function getCtx() {
  if (!audioCtx) audioCtx = new AudioCtx();
  return audioCtx;
}

function playTone(freq, duration, type = "sine", vol = 0.15) {
  if (muted) return;
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime);
  gain.gain.setValueAtTime(vol, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + duration);
}

const audio = {
  correct() {
    playTone(880, 0.15, "sine", 0.12);
    setTimeout(() => playTone(1100, 0.2, "sine", 0.12), 100);
  },
  wrong() {
    playTone(200, 0.3, "square", 0.08);
  },
  click() {
    playTone(660, 0.05, "sine", 0.07);
  },
  celebrate() {
    // short ascending arpeggio
    [523, 659, 784, 1047].forEach((f, i) => {
      setTimeout(() => playTone(f, 0.15, "sine", 0.12), i * 100);
    });
  },
  toggleMute() {
    muted = !muted;
    const icon = document.getElementById("muteIcon");
    if (icon) icon.textContent = muted ? "🔇" : "🔊";
    return muted;
  },
  isMuted() {
    return muted;
  },
};

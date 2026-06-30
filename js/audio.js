// js/audio.js
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx;
let muted = false;

function getCtx() {
  if (!audioCtx) audioCtx = new AudioCtx();
  if (audioCtx.state === "suspended") audioCtx.resume();
  return audioCtx;
}

function playTone(freq, duration, type = "sine", vol = 0.15, ramp = true) {
  if (muted) return;
  try {
    const ctx = getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(vol, ctx.currentTime);
    if (ramp) {
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    }
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    // ignore errors from autoplay etc.
  }
}

function playNoise(duration, vol = 0.05) {
  if (muted) return;
  try {
    const ctx = getCtx();
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    source.connect(gain);
    gain.connect(ctx.destination);
    source.start(ctx.currentTime);
  } catch (e) {}
}

const audio = {
  // ---------- UI sounds ----------
  click() {
    playTone(800, 0.05, "sine", 0.08);
  },
  softClick() {
    playTone(600, 0.04, "sine", 0.06);
  },
  transition() {
    playTone(300, 0.15, "sine", 0.1);
    setTimeout(() => playTone(500, 0.15, "sine", 0.1), 80);
  },
  home() {
    playTone(400, 0.15, "sine", 0.08);
    setTimeout(() => playTone(250, 0.2, "sine", 0.08), 100);
  },
  skip() {
    playTone(350, 0.1, "triangle", 0.08);
  },

  // ---------- Quiz / feedback ----------
  correct() {
    playTone(880, 0.1, "sine", 0.12);
    setTimeout(() => playTone(1100, 0.15, "sine", 0.12), 80);
    setTimeout(() => playTone(1320, 0.15, "sine", 0.12), 160);
  },
  wrong() {
    playTone(200, 0.25, "triangle", 0.1);
  },

  // ---------- XP & celebration ----------
  xpGain() {
    [523, 659, 784, 1047].forEach((f, i) => {
      setTimeout(() => playTone(f, 0.12, "sine", 0.1), i * 60);
    });
  },
  celebrate() {
    [523, 659, 784, 1047, 1319, 1568].forEach((f, i) => {
      setTimeout(() => playTone(f, 0.15, "sine", 0.12), i * 80);
    });
  },

  // ---------- Chemistry specific ----------
  atomTap() {
    playTone(1200, 0.06, "sine", 0.08);
  },
  electronTransfer() {
    // whoosh
    playNoise(0.3, 0.04);
    setTimeout(() => playTone(600, 0.15, "sine", 0.1), 200);
    setTimeout(() => playTone(900, 0.2, "sine", 0.12), 400);
  },
  electronLanding() {
    playTone(1000, 0.1, "sine", 0.1);
    setTimeout(() => playTone(1200, 0.15, "sine", 0.1), 100);
  },
  octetAdd() {
    playTone(700, 0.04, "sine", 0.06);
  },
  octetFull() {
    [600, 800, 1000].forEach((f, i) => {
      setTimeout(() => playTone(f, 0.1, "sine", 0.08), i * 80);
    });
  },
  sortCorrect() {
    playTone(500, 0.08, "triangle", 0.08);
    setTimeout(() => playTone(700, 0.08, "triangle", 0.08), 60);
  },
  sortWrong() {
    playTone(180, 0.2, "square", 0.06);
  },
  fillCorrect() {
    playTone(660, 0.06, "sine", 0.07);
  },
  fillComplete() {
    [523, 659, 784, 1047].forEach((f, i) => {
      setTimeout(() => playTone(f, 0.12, "sine", 0.09), i * 90);
    });
  },
  bondPull() {
    playTone(400, 0.5, "sawtooth", 0.03, false);
  },

  // ---------- Survey ----------
  starTick() {
    playTone(1000, 0.05, "sine", 0.08);
  },

  // ---------- Ambient ----------
  ambientStart() {
    if (muted) return;
    // This is a simple low drone that loops quietly
    try {
      const ctx = getCtx();
      if (audio._ambientOsc) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(55, ctx.currentTime);
      gain.gain.setValueAtTime(0.02, ctx.currentTime);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      audio._ambientOsc = osc;
      audio._ambientGain = gain;
    } catch (e) {}
  },
  ambientStop() {
    if (audio._ambientOsc) {
      audio._ambientOsc.stop();
      audio._ambientOsc = null;
      audio._ambientGain = null;
    }
  },

  // ---------- Mute control ----------
  toggleMute() {
    muted = !muted;
    const icon = document.getElementById("muteIcon");
    if (icon) icon.textContent = muted ? "🔇" : "🔊";
    if (muted) {
      audio.ambientStop();
    } else {
      audio.ambientStart();
    }
    return muted;
  },
  isMuted() {
    return muted;
  },
};

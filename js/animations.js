// js/animations.js
// Elegant confetti system – small, soft, celebratory

const confettiCanvas = document.getElementById("confettiCanvas");
const ctx = confettiCanvas.getContext("2d");
confettiCanvas.width = window.innerWidth;
confettiCanvas.height = window.innerHeight;
let confettiParticles = [];

function launchConfetti() {
  for (let i = 0; i < 40; i++) {
    confettiParticles.push({
      x: Math.random() * confettiCanvas.width,
      y: Math.random() * confettiCanvas.height * 0.3,
      vx: (Math.random() - 0.5) * 4,
      vy: Math.random() * 4 + 2,
      size: Math.random() * 4 + 2, // 2–6px – small and light
      color: `hsla(${Math.random() * 60 + 200}, 70%, 65%, 0.9)`, // soft blues/teals
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 5,
    });
  }
  if (!animating) requestAnimationFrame(drawConfetti);
}

let animating = false;
function drawConfetti() {
  animating = true;
  ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  confettiParticles = confettiParticles.filter(
    (p) => p.y < confettiCanvas.height + 20
  );
  confettiParticles.forEach((p) => {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate((p.rotation * Math.PI) / 180);
    ctx.beginPath();
    ctx.arc(0, 0, p.size, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.fill();
    ctx.restore();
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.08;
    p.rotation += p.rotationSpeed;
  });
  if (confettiParticles.length > 0) requestAnimationFrame(drawConfetti);
  else animating = false;
}

function celebrate() {
  launchConfetti();
}

// Keep canvas sized correctly on resize
window.addEventListener("resize", () => {
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
});

// js/synthesis-challenge.js

function initSynthesis() {
  const moduleCard = document.getElementById("module4Card");

  function showPhase(num) {
    trackPhaseEnter(4, num);
    moduleCard
      .querySelectorAll(".phase")
      .forEach((p) => (p.style.display = "none"));
    const phaseDiv = document.getElementById("p4-phase" + num);
    if (!phaseDiv) return;
    phaseDiv.style.display = "block";

    // For Phase 2, make sure the track is visible on mobile
    if (num === 2) {
      setTimeout(() => {
        const track = document.getElementById("synthTrack2");
        if (track) {
          track.offsetHeight; // force reflow
          const stepEl = document.getElementById("step4");
          if (stepEl) {
            const stepRect = stepEl.getBoundingClientRect();
            const trackRect = track.getBoundingClientRect();
            const scrollTo =
              trackRect.top - stepRect.top + stepEl.scrollTop - 20;
            stepEl.scrollTo({ top: scrollTo, behavior: "smooth" });
          }
        }
      }, 100);
    }
  }

  // ========================
  // PHASE 1 – Inertia
  // ========================
  function setupPhase1() {
    const track = document.getElementById("synthTrack1");
    const road = document.getElementById("roadScroll");
    const ice = document.getElementById("icePatch");
    const block = document.getElementById("blockBody");
    const btnRun = document.getElementById("btnRunSim1");
    const btnReplay = document.getElementById("btnReplay1");
    const msg = document.getElementById("simMsg4P1");
    const preQuiz = document.getElementById("p4-q0");
    const mainQuiz = document.getElementById("p4-q1");

    let bgPos = 0;
    let speed = 0;
    let phase = "before";
    let animFrame;

    const accelBefore = 3.5;
    const accelAfter = 5.5;
    const iceTriggerPos = -400;
    const stopPos = -1300;

    function resetSim() {
      bgPos = 0;
      speed = 0;
      phase = "before";
      road.style.transform = "translateX(0)";
      ice.style.opacity = "0";
      block.style.left = "50%";
    }

    function animate() {
      if (phase === "before") {
        speed += accelBefore * 0.016;
      } else {
        speed += accelAfter * 0.016;
        let blockOffset = parseFloat(block.style.left) || 50;
        blockOffset -= 0.4;
        block.style.left = blockOffset + "%";
        if (blockOffset < 20) block.style.left = "20%";
      }

      bgPos -= speed * 0.45;

      if (phase === "before" && bgPos < iceTriggerPos) {
        phase = "after";
        ice.style.opacity = "1";
        msg.innerHTML =
          "❄️ Ice patch! Friction gone. Watch the block slide backward.";
        msg.style.color = "var(--white)";
        audio.forceApply(); // 🎵 PHYSICS SOUND – ice hit
      }

      road.style.transform = `translateX(${bgPos}px)`;

      if (bgPos < stopPos) {
        stopAnim();
        msg.innerHTML +=
          "<br>Simulation complete. The block slid backward due to inertia.";
        btnReplay.style.display = "inline-block";
        preQuiz.style.display = "block";
        setupPreQuiz();
        return;
      }

      animFrame = requestAnimationFrame(animate);
    }

    function stopAnim() {
      if (animFrame) cancelAnimationFrame(animFrame);
    }

    btnRun.addEventListener("click", () => {
      resetSim();
      stopAnim();
      btnRun.style.display = "none";
      btnReplay.style.display = "none";
      btnReplay.disabled = false;
      preQuiz.style.display = "none";
      mainQuiz.style.display = "none";
      msg.innerHTML = "Cart and block moving together...";
      audio.forceApply(); // 🎵 PHYSICS SOUND – cart starts moving
      animate();
    });

    btnReplay.addEventListener("click", () => {
      resetSim();
      stopAnim();
      btnReplay.style.display = "none";
      preQuiz.style.display = "none";
      mainQuiz.style.display = "none";
      msg.innerHTML = "Replaying...";
      animate();
    });
  }

  function setupPreQuiz() {
    const input = document.getElementById("input4Q0");
    const check = document.getElementById("check4Q0");
    const fb = document.getElementById("fb4Q0");
    const nextBtn = document.getElementById("next4Q0");

    check.addEventListener("click", () => {
      const val = parseFloat(input.value);
      if (val === 4) {
        fb.innerHTML = "✔ Correct! a = 10 N / 2.5 kg = 4 m/s².";
        fb.style.color = "var(--green)";
        audio.correct();
        haptics.correct();
        haptics.applyAnimation(fb, "correct");
        nextBtn.style.display = "inline-block";
      } else {
        fb.innerHTML = "✗ Use a = F ÷ m. Total mass is 2.5 kg.";
        fb.style.color = "var(--red)";
        audio.wrong();
        haptics.wrong();
        haptics.applyAnimation(fb, "wrong");
      }
    });

    nextBtn.addEventListener("click", () => {
      document.getElementById("p4-q0").style.display = "none";
      document.getElementById("p4-q1").style.display = "block";
      setupPhase1InertiaQuiz();
    });
  }

  function setupPhase1InertiaQuiz() {
    const opts = document.getElementById("opts4Q1");
    const fb = document.getElementById("fb4Q1");
    const nextBtn = document.getElementById("next4Q1");

    opts.innerHTML = "";

    const choices = [
      { text: "The block slides backward relative to the cart", correct: true },
      { text: "The block stays exactly in place on the cart", correct: false },
      { text: "The block flies forward off the cart", correct: false },
    ];
    choices.forEach((choice) => {
      const btn = document.createElement("div");
      btn.className = "option";
      btn.textContent = choice.text;
      btn.addEventListener("click", () => {
        opts
          .querySelectorAll(".option")
          .forEach((o) => o.classList.remove("correct", "wrong"));
        if (choice.correct) {
          btn.classList.add("correct");
          fb.innerHTML =
            "✔ Correct! Inertia keeps the block moving at its previous speed while the cart accelerates.";
          fb.style.color = "var(--green)";
          audio.correct();
          haptics.correct();
          haptics.applyAnimation(fb, "correct");
          opts
            .querySelectorAll(".option")
            .forEach((o) => (o.style.pointerEvents = "none"));
          nextBtn.style.display = "inline-block";
        } else {
          btn.classList.add("wrong");
          fb.innerHTML =
            "✗ Think: the block wants to maintain its motion, but the cart is changing speed.";
          fb.style.color = "var(--red)";
          audio.wrong();
          haptics.wrong();
          haptics.applyAnimation(fb, "wrong");
        }
      });
      opts.appendChild(btn);
    });

    nextBtn.addEventListener("click", () => {
      showPhase(2);
      setupPhase2();
    });
  }

  // ========================
  // PHASE 2 – F = ma
  // ========================
  let cleanupPhase2 = null;

  function setupPhase2() {
    const track = document.getElementById("synthTrack2");
    const road = document.getElementById("roadScroll2");
    const btnRun = document.getElementById("btnRunSim2");
    const btnReplay = document.getElementById("btnReplay2");
    const msg = document.getElementById("simMsg4P2");
    const quizDivA = document.getElementById("p4-q2a");
    const quizDivB = document.getElementById("p4-q2b");

    let posX = 0;
    let speed = 0;
    let animFrame;

    const accel = 5;
    const maxSpeed = 160;
    const tileWidth = 80;
    const showMsgAt = 600;
    const stopAt = 2000;

    function resetSim() {
      if (animFrame) cancelAnimationFrame(animFrame);
      posX = 0;
      speed = 0;
      road.style.backgroundPosition = "0 0";
      msg.innerHTML = "Cart accelerating…";
      msg.style.color = "var(--white)";
      quizDivA.style.display = "none";
      quizDivB.style.display = "none";
      btnReplay.style.display = "none";
      btnReplay.disabled = false;
      btnRun.style.display = "inline-block";
    }

    function animate() {
      if (speed < maxSpeed) {
        speed += accel * 0.016;
      }
      posX += speed * 0.5;
      const wrappedX = posX % tileWidth;
      road.style.backgroundPosition = `${wrappedX}px 0`;

      if (posX > showMsgAt && !msg.innerHTML.includes("What's its mass")) {
        msg.innerHTML =
          "The cart is moving faster than before. What's its mass now?";
        msg.style.color = "var(--white)";
      }

      if (posX > stopAt) {
        stopAnim();
        btnRun.style.display = "none";
        btnReplay.style.display = "inline-block";
        btnReplay.disabled = false;
        quizDivA.style.display = "block";
        setupPhase2MassQuestion();
        return;
      }
      animFrame = requestAnimationFrame(animate);
    }

    function stopAnim() {
      if (animFrame) cancelAnimationFrame(animFrame);
    }

    cleanupPhase2 = stopAnim;

    btnRun.addEventListener("click", () => {
      resetSim();
      btnRun.style.display = "none";
      audio.forceApply(); // 🎵 PHYSICS SOUND – cart runs alone
      animate();
    });

    btnReplay.addEventListener("click", () => {
      if (animFrame) cancelAnimationFrame(animFrame);
      posX = 0;
      speed = 0;
      road.style.backgroundPosition = "0 0";
      msg.innerHTML = "Replaying…";
      msg.style.color = "var(--white)";
      quizDivA.style.display = "none";
      quizDivB.style.display = "none";
      btnReplay.style.display = "none";
      btnReplay.disabled = false;
      btnRun.style.display = "none";
      animate();
    });
  }

  function setupPhase2MassQuestion() {
    const opts = document.getElementById("opts4Q2a");
    const fb = document.getElementById("fb4Q2a");
    const nextBtn = document.getElementById("next4Q2a");

    opts.innerHTML = "";

    const choices = [
      { text: "2.0 kg (only the cart)", correct: true },
      { text: "2.5 kg (cart + block)", correct: false },
      { text: "0.5 kg (only the block)", correct: false },
    ];
    choices.forEach((choice) => {
      const btn = document.createElement("div");
      btn.className = "option";
      btn.textContent = choice.text;
      btn.addEventListener("click", () => {
        opts
          .querySelectorAll(".option")
          .forEach((o) => o.classList.remove("correct", "wrong"));
        if (choice.correct) {
          btn.classList.add("correct");
          fb.innerHTML =
            "✔ Correct! The block is gone, so only the cart's mass remains (2.0 kg).";
          fb.style.color = "var(--green)";
          audio.correct();
          haptics.correct();
          haptics.applyAnimation(fb, "correct");
          opts
            .querySelectorAll(".option")
            .forEach((o) => (o.style.pointerEvents = "none"));
          nextBtn.style.display = "inline-block";
        } else {
          btn.classList.add("wrong");
          fb.innerHTML =
            "✗ Think: which mass is still being pulled by the force?";
          fb.style.color = "var(--red)";
          audio.wrong();
          haptics.wrong();
          haptics.applyAnimation(fb, "wrong");
        }
      });
      opts.appendChild(btn);
    });

    nextBtn.addEventListener("click", () => {
      document.getElementById("p4-q2a").style.display = "none";
      document.getElementById("p4-q2b").style.display = "block";
      setupPhase2CalcQuestion();
    });
  }

  function setupPhase2CalcQuestion() {
    const input = document.getElementById("input4Q2");
    const check = document.getElementById("check4Q2");
    const fb = document.getElementById("fb4Q2");
    const nextBtn = document.getElementById("next4Q2");

    check.addEventListener("click", () => {
      const val = parseFloat(input.value);
      if (val === 5) {
        fb.innerHTML = "✔ Correct! a = 10 N / 2 kg = 5 m/s².";
        fb.style.color = "var(--green)";
        audio.correct();
        haptics.correct();
        haptics.applyAnimation(fb, "correct");
        nextBtn.style.display = "inline-block";
      } else {
        fb.innerHTML = "✗ Use a = F ÷ m. The mass is 2.0 kg.";
        fb.style.color = "var(--red)";
        audio.wrong();
        haptics.wrong();
        haptics.applyAnimation(fb, "wrong");
      }
    });

    nextBtn.addEventListener("click", () => {
      if (cleanupPhase2) cleanupPhase2();
      showPhase(3);
      setupPhase3();
    });
  }

  // ========================
  // PHASE 3 – Action-Reaction
  // ========================
  function setupPhase3() {
    const opts = document.getElementById("opts4Q3");
    const fb = document.getElementById("fb4Q3");
    const nextBtn = document.getElementById("next4Q3");

    opts.innerHTML = "";

    const choices = [
      {
        text: "Cart pulls block forward; block pulls cart backward",
        correct: true,
      },
      {
        text: "Cart pushes block backward; block pushes cart forward",
        correct: false,
      },
      { text: "No forces between them", correct: false },
    ];
    choices.forEach((choice) => {
      const btn = document.createElement("div");
      btn.className = "option";
      btn.textContent = choice.text;
      btn.addEventListener("click", () => {
        opts
          .querySelectorAll(".option")
          .forEach((o) => o.classList.remove("correct", "wrong"));
        if (choice.correct) {
          btn.classList.add("correct");
          fb.innerHTML =
            "✔ Exactly. They exert equal and opposite forces on each other.";
          fb.style.color = "var(--green)";
          audio.correct();
          haptics.correct();
          haptics.applyAnimation(fb, "correct");
          opts
            .querySelectorAll(".option")
            .forEach((o) => (o.style.pointerEvents = "none"));
          nextBtn.style.display = "inline-block";
        } else {
          btn.classList.add("wrong");
          fb.innerHTML =
            "✗ Remember: forces come in pairs. Which object pulled which?";
          fb.style.color = "var(--red)";
          audio.wrong();
          haptics.wrong();
          haptics.applyAnimation(fb, "wrong");
        }
      });
      opts.appendChild(btn);
    });

    nextBtn.addEventListener("click", () => {
      showPhase(4);
      setupPhase4();
    });
  }

  // ========================
  // PHASE 4 – Full Picture
  // ========================
  function setupPhase4() {
    document.getElementById("next4P4").addEventListener("click", () => {
      addXP(100);
      audio.xpGain(); // 🎵 SOUND
      markModuleDone("synthesis");
      celebrate();
      goToStep(5);
    });
  }

  // Initialize
  showPhase(1);
  setupPhase1();
}

// js/synthesis-challenge.js

function initSynthesis() {
  const moduleCard = document.getElementById("module4Card");

  function showPhase(num) {
    moduleCard
      .querySelectorAll(".phase")
      .forEach((p) => (p.style.display = "none"));
    const phaseDiv = document.getElementById("p4-phase" + num);
    if (phaseDiv) phaseDiv.style.display = "block";
  }

  // ========================
  // PHASE 1 – Inertia (scrolling background, realistic)
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

    const accelBefore = 4; // visual scaling
    const accelAfter = 5;
    const iceTriggerPos = -600;

    function resetSim() {
      bgPos = 0;
      speed = 0;
      phase = "before";
      road.style.transform = "translateX(0)";
      ice.style.transform = "translateX(0)";
      ice.style.opacity = "0";
      block.style.left = "50%";
    }

    function animate() {
      if (phase === "before") {
        speed += accelBefore * 0.016;
      } else {
        speed += accelAfter * 0.016;
        let blockOffset = parseFloat(block.style.left) || 50;
        blockOffset -= 0.3;
        block.style.left = blockOffset + "%";
        if (blockOffset < 30) block.style.left = "30%";
      }

      bgPos -= speed * 0.5;

      if (phase === "before" && bgPos < iceTriggerPos) {
        phase = "after";
        ice.style.opacity = "1";
        msg.innerHTML =
          "Ice patch! Friction gone. Watch the block slide backward.";
      }

      road.style.transform = `translateX(${bgPos}px)`;
      ice.style.transform = `translateX(${bgPos}px)`;

      if (bgPos < -1200) {
        stopAnim();
        msg.innerHTML +=
          "<br>Simulation complete. The block slid backward due to inertia.";
        btnReplay.style.display = "inline-block";
        // Show the pre‑quiz first
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
      preQuiz.style.display = "none";
      mainQuiz.style.display = "none";
      msg.innerHTML = "Cart and block moving together...";
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

  // Pre‑quiz: calculate initial acceleration
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

  // Inertia quiz
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
  // PHASE 2 – F = ma (two‑step discovery)
  // ========================
  function setupPhase2() {
    const track = document.getElementById("synthTrack2");
    const road = document.getElementById("roadScroll2");
    const accelBadge = document.getElementById("accelBadge");
    const btnRun = document.getElementById("btnRunSim2");
    const btnReplay = document.getElementById("btnReplay2");
    const msg = document.getElementById("simMsg4P2");
    const quizDivA = document.getElementById("p4-q2a");
    const quizDivB = document.getElementById("p4-q2b");

    let bgPos = 0;
    let speed = 0;
    let animFrame;

    const accel = 5;
    const maxSpeed = 200;

    function resetSim() {
      bgPos = 0;
      speed = 0;
      road.style.transform = "translateX(0)";
      accelBadge.textContent = "a = ? m/s²";
      accelBadge.style.background = "rgba(0,0,0,0.6)";
    }

    function animate() {
      if (speed < maxSpeed) {
        speed += accel * 0.016;
      }
      bgPos -= speed * 0.5;
      road.style.transform = `translateX(${bgPos}px)`;

      if (bgPos < -800) {
        stopAnim();
        msg.innerHTML =
          "The cart is moving faster than before. What's its mass now?";
        btnReplay.style.display = "inline-block";
        quizDivA.style.display = "block";
        setupPhase2MassQuestion();
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
      quizDivA.style.display = "none";
      quizDivB.style.display = "none";
      msg.innerHTML = "Cart accelerating...";
      animate();
    });

    btnReplay.addEventListener("click", () => {
      resetSim();
      stopAnim();
      btnReplay.style.display = "none";
      quizDivA.style.display = "none";
      quizDivB.style.display = "none";
      msg.innerHTML = "Replaying...";
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
    const accelBadge = document.getElementById("accelBadge");

    check.addEventListener("click", () => {
      const val = parseFloat(input.value);
      if (val === 5) {
        fb.innerHTML = "✔ Correct! a = 10 N / 2 kg = 5 m/s².";
        fb.style.color = "var(--green)";
        audio.correct();
        haptics.correct();
        haptics.applyAnimation(fb, "correct");
        accelBadge.textContent = "a = 5 m/s²";
        accelBadge.style.background = "rgba(46,204,113,0.3)";
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
      markModuleDone("synthesis");
      celebrate();
      goToStep(5);
    });
  }

  // Initialize
  showPhase(1);
  setupPhase1();
}

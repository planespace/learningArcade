// js/module3-pairs.js

function initModule3() {
  console.log("✅ initModule3 called");
  const moduleCard = document.getElementById("module3Card");

  function showPhase(num) {
    moduleCard
      .querySelectorAll(".phase")
      .forEach((p) => (p.style.display = "none"));
    const phaseDiv = document.getElementById("p3-phase" + num);
    if (phaseDiv) phaseDiv.style.display = "block";
    return phaseDiv;
  }

  // ========================
  // PHASE 1 – Discover: Push on skates
  // ========================
  function setupPhase1() {
    const btnPush = document.getElementById("btnPushAB3");
    const msg = document.getElementById("simMsg3P1");
    const skaterA = document.getElementById("skaterA3");
    const skaterB = document.getElementById("skaterB3");
    const arrowA = document.getElementById("arrowA3");
    const arrowB = document.getElementById("arrowB3");
    const nextAfterPush = document.getElementById("nextAfterPush");

    if (!btnPush) return;

    btnPush.addEventListener("click", () => {
      skaterA.style.transform = "translateX(-40px)";
      skaterB.style.transform = "translateX(40px)";
      arrowA.style.display = "block";
      arrowB.style.display = "block";
      msg.innerHTML =
        "Both skaters moved! The push created equal and opposite forces.";
      msg.style.color = "var(--teal)";
      btnPush.style.display = "none";
      nextAfterPush.style.display = "inline-block";
    });

    nextAfterPush.addEventListener("click", () => {
      nextAfterPush.style.display = "none";
      showQuizModal();
    });
  }

  function showQuizModal() {
    const overlay = document.createElement("div");
    overlay.className = "quiz-modal-overlay";
    overlay.innerHTML = `
        <div class="quiz-modal">
            <p class="quiz-question">What did you notice when A pushed B?</p>
            <div class="quiz-options" id="modalOpts"></div>
            <div class="quiz-feedback" id="modalFb"></div>
            <button class="btn btn-next" id="modalNextBtn" style="display:none; margin-top:1rem;">Next →</button>
        </div>
    `;
    document.body.appendChild(overlay);

    const opts = document.getElementById("modalOpts");
    const fb = document.getElementById("modalFb");
    const modalNextBtn = document.getElementById("modalNextBtn");

    opts.innerHTML = "";

    const choices = [
      { text: "Only B moved", correct: false },
      { text: "Both A and B moved", correct: true },
      { text: "Only A moved", correct: false },
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
            "✔ Correct! Forces come in pairs. A pushed B, and B pushed back on A.";
          fb.style.color = "var(--green)";
          audio.correct();
          haptics.correct();
          haptics.applyAnimation(fb, "correct");
          opts
            .querySelectorAll(".option")
            .forEach((o) => (o.style.pointerEvents = "none"));
          modalNextBtn.style.display = "inline-block";
        } else {
          btn.classList.add("wrong");
          fb.innerHTML =
            "✗ Watch again – both skaters moved in opposite directions.";
          fb.style.color = "var(--red)";
          audio.wrong();
          haptics.wrong();
          haptics.applyAnimation(fb, "wrong");
        }
      });
      opts.appendChild(btn);
    });

    modalNextBtn.addEventListener("click", () => {
      overlay.remove();
      showPhase(2);
      setupPhase2();
    });
  }

  // ========================
  // PHASE 2 – Learn the law
  // ========================
  function setupPhase2() {
    const stepEl = document.getElementById("step3");
    if (stepEl) {
      stepEl.scrollTo({ top: 0, behavior: "instant" });
    }

    const lawConceptBox = document.querySelector("#p3-phase2 .concept-box");
    const nextP2A = document.getElementById("next3P2A");
    const check1Div = document.getElementById("p3-check1");

    nextP2A.addEventListener("click", () => {
      if (lawConceptBox) lawConceptBox.style.display = "none";
      nextP2A.style.display = "none";
      check1Div.style.display = "block";
      setupCheck1();
    });
  }

  function setupCheck1() {
    const opts = document.getElementById("opts3C1");
    const fb = document.getElementById("fb3C1");
    const nextBtn = document.getElementById("next3C1");
    opts.innerHTML = "";

    const choices = [
      { text: "Nail pushes back on hammer", correct: true },
      { text: "Hammer moves", correct: false },
      { text: "Nail bends", correct: false },
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
            "✔ Correct! The nail exerts an equal and opposite force on the hammer.";
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
            "✗ Think: forces come in pairs. The hammer can't push without being pushed back.";
          fb.style.color = "var(--red)";
          audio.wrong();
          haptics.wrong();
          haptics.applyAnimation(fb, "wrong");
        }
      });
      opts.appendChild(btn);
    });
    nextBtn.addEventListener("click", () => {
      document.getElementById("p3-check1").style.display = "none";
      document.getElementById("p3-check2").style.display = "block";
      setupCheck2();
    });
  }

  function setupCheck2() {
    const opts = document.getElementById("opts3C2");
    const fb = document.getElementById("fb3C2");
    const nextBtn = document.getElementById("next3C2");
    opts.innerHTML = "";

    const choices = [
      { text: "0 N", correct: false },
      { text: "25 N", correct: false },
      { text: "50 N", correct: true },
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
          fb.innerHTML = "✔ Correct! The wall pushes back with exactly 50 N.";
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
            "✗ Forces are equal. If you push with 50 N, the wall returns 50 N.";
          fb.style.color = "var(--red)";
          audio.wrong();
          haptics.wrong();
          haptics.applyAnimation(fb, "wrong");
        }
      });
      opts.appendChild(btn);
    });
    nextBtn.addEventListener("click", () => {
      document.getElementById("p3-check2").style.display = "none";
      document.getElementById("p3-check3").style.display = "block";
      setupCheck3();
    });
  }

  function setupCheck3() {
    const input = document.getElementById("input3C3");
    const check = document.getElementById("check3C3");
    const fb = document.getElementById("fb3C3");
    const nextBtn = document.getElementById("next3C3");
    const transitionDiv = document.getElementById("p3-transition");

    check.addEventListener("click", () => {
      const val = parseFloat(input.value);
      if (val === 100) {
        fb.innerHTML =
          "✔ Correct! The ball exerts 100 N on the bat – equal and opposite.";
        fb.style.color = "var(--green)";
        audio.correct();
        haptics.correct();
        haptics.applyAnimation(fb, "correct");
        nextBtn.style.display = "inline-block";
      } else {
        fb.innerHTML =
          "✗ Hint: Forces are always equal. The bat hits with 100 N, so the ball returns 100 N.";
        fb.style.color = "var(--red)";
        audio.wrong();
        haptics.wrong();
        haptics.applyAnimation(fb, "wrong");
      }
    });

    nextBtn.addEventListener("click", () => {
      document.getElementById("p3-check3").style.display = "none";
      transitionDiv.style.display = "block";
      setTimeout(() => {
        transitionDiv.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
    });

    document.getElementById("next3P2").addEventListener("click", () => {
      showPhase(3);
      setupPhase3();
      const phase3 = document.getElementById("p3-phase3");
      if (phase3) {
        phase3.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }

  // ========================
  // PHASE 3 – Playground
  // ========================
  function setupPhase3() {
    const slider = document.getElementById("forceSlider3");
    const forceVal = document.getElementById("forceVal3");
    const btnApply = document.getElementById("btnApplyForce3");
    const btnReset = document.getElementById("btnReset3");
    const msg = document.getElementById("simMsg3P3");
    const arrowA = document.getElementById("explorerArrowA");
    const arrowB = document.getElementById("explorerArrowB");

    function updateArrows(force) {
      arrowA.innerHTML = `← ${force} N`;
      arrowA.style.display = "block";
      arrowB.innerHTML = `${force} N →`;
      arrowB.style.display = "block";
      msg.innerHTML = `A pushes B with ${force} N. B pushes back on A with ${force} N. They are equal and opposite.`;
      msg.style.color = "var(--teal)";
    }

    btnApply.addEventListener("click", () => {
      const force = parseInt(slider.value);
      updateArrows(force);
    });

    btnReset.addEventListener("click", () => {
      arrowA.style.display = "none";
      arrowB.style.display = "none";
      msg.innerHTML = "";
    });

    slider.addEventListener("input", () => {
      forceVal.textContent = slider.value;
    });

    document.getElementById("next3P3").addEventListener("click", () => {
      showPhase(4);
      setupPhase4();
      const phase4 = document.getElementById("p3-phase4");
      if (phase4) phase4.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  // ========================
  // PHASE 4 – Transfer: Jump
  // ========================
  function setupPhase4() {
    const opts = document.getElementById("opts3P4");
    const fb = document.getElementById("fb3P4");
    const nextBtn = document.getElementById("next3P4");
    opts.innerHTML = "";

    const choices = [
      {
        text: "The Earth pushes you upward with an equal force",
        correct: true,
      },
      { text: "You are lighter than the Earth", correct: false },
      { text: "Your force overcomes gravity", correct: false },
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
            "✔ Exactly! You push down on Earth, Earth pushes you up. Action‑reaction pair.";
          fb.style.color = "var(--green)";
          audio.correct();
          haptics.correct();
          haptics.applyAnimation(fb, "correct");
          addXP(30);
          nextBtn.style.display = "inline-block";
        } else {
          btn.classList.add("wrong");
          fb.innerHTML =
            "✗ Remember: forces come in equal pairs. The Earth must push you up.";
          fb.style.color = "var(--red)";
          audio.wrong();
          haptics.wrong();
          haptics.applyAnimation(fb, "wrong");
        }
      });
      opts.appendChild(btn);
    });
    nextBtn.addEventListener("click", () => {
      showPhase(5);
      setupPhase5();
    });
  }

  // ========================
  // PHASE 5 – Summary
  // ========================
  function setupPhase5() {
    document.getElementById("next3P5").addEventListener("click", () => {
      addXP(20);
      markModuleDone("m3");
      celebrate();
      goToStep(4);
    });
  }

  // Initialize
  showPhase(1);
  setupPhase1();
}

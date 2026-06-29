// js/module2-fma.js

function initModule2() {
  const moduleCard = document.getElementById("module2Card");

  function showPhase(num) {
    trackPhaseEnter(2, num);
    moduleCard
      .querySelectorAll(".phase")
      .forEach((p) => (p.style.display = "none"));
    const phaseDiv = document.getElementById("p2-phase" + num);
    if (phaseDiv) phaseDiv.style.display = "block";
    return phaseDiv;
  }

  // ========================
  // PHASE 1 – Explore sliders
  // ========================
  function setupPhase1() {
    const track = document.getElementById("trackP1");
    const arrowContainer = document.createElement("div");
    arrowContainer.className = "arrow-container";
    track.appendChild(arrowContainer);

    const arrow = document.createElement("div");
    arrow.className = "direction-arrow block-arrow";
    arrow.textContent = "➡️";
    arrow.style.display = "block";
    arrowContainer.appendChild(arrow);

    const massSlider = document.getElementById("massSlider");
    const forceSlider = document.getElementById("forceSlider");
    const massVal = document.getElementById("massVal");
    const forceVal = document.getElementById("forceVal");
    const accelVal = document.getElementById("accelVal");

    track.style.backgroundImage =
      "radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)";
    track.style.backgroundSize = "40px 40px";
    track.style.backgroundRepeat = "repeat";
    track.style.backgroundPosition = "0 0";

    let acceleration = 5;
    const SCROLL_SPEED = 0.75;
    let bgX = 0;

    function updateAcceleration() {
      const mass = parseFloat(massSlider.value);
      const force = parseFloat(forceSlider.value);
      massVal.textContent = mass;
      forceVal.textContent = force;
      acceleration = force / mass;
      accelVal.textContent = acceleration.toFixed(2);
    }

    massSlider.addEventListener("input", updateAcceleration);
    forceSlider.addEventListener("input", updateAcceleration);
    updateAcceleration();

    function animate() {
      bgX -= acceleration * SCROLL_SPEED;
      track.style.backgroundPosition = bgX + "px 0";
      requestAnimationFrame(animate);
    }
    animate();

    // ---- Question 1 ----
    const optsQ1 = document.getElementById("optsP1Q1");
    const fbQ1 = document.getElementById("fbP1Q1");
    const q1Div = document.getElementById("p1-q1");
    const q2Div = document.getElementById("p1-q2");
    const nextQ1 = document.createElement("button");
    nextQ1.className = "btn btn-next";
    nextQ1.textContent = "Next →";
    nextQ1.style.display = "none";
    q1Div.appendChild(nextQ1);

    const choices1 = [
      { text: "Increases", correct: true },
      { text: "Decreases", correct: false },
      { text: "Stays the same", correct: false },
    ];
    choices1.forEach((choice) => {
      const btn = document.createElement("div");
      btn.className = "option";
      btn.textContent = choice.text;
      btn.addEventListener("click", () => {
        optsQ1
          .querySelectorAll(".option")
          .forEach((o) => o.classList.remove("correct", "wrong"));
        if (choice.correct) {
          btn.classList.add("correct");
          fbQ1.innerHTML = "✔ Correct. More force → more acceleration.";
          fbQ1.style.color = "var(--green)";
          audio.correct();
          haptics.correct();
          haptics.applyAnimation(fbQ1, "correct");
          optsQ1
            .querySelectorAll(".option")
            .forEach((o) => (o.style.pointerEvents = "none"));
          nextQ1.style.display = "inline-block";
        } else {
          btn.classList.add("wrong");
          fbQ1.innerHTML =
            "✗ Think: if you push harder, does it speed up more?";
          fbQ1.style.color = "var(--red)";
          audio.wrong();
          haptics.wrong();
          haptics.applyAnimation(fbQ1, "wrong");
        }
      });
      optsQ1.appendChild(btn);
    });

    nextQ1.addEventListener("click", () => {
      q1Div.style.display = "none";
      q2Div.style.display = "block";
      setupPhase1Q2();
    });
  }

  function setupPhase1Q2() {
    const optsQ2 = document.getElementById("optsP1Q2");
    const fbQ2 = document.getElementById("fbP1Q2");
    const nextBtn = document.getElementById("nextP1");
    const choices2 = [
      { text: "Increases", correct: false },
      { text: "Decreases", correct: true },
      { text: "Stays the same", correct: false },
    ];
    choices2.forEach((choice) => {
      const btn = document.createElement("div");
      btn.className = "option";
      btn.textContent = choice.text;
      btn.addEventListener("click", () => {
        optsQ2
          .querySelectorAll(".option")
          .forEach((o) => o.classList.remove("correct", "wrong"));
        if (choice.correct) {
          btn.classList.add("correct");
          fbQ2.innerHTML = "✔ Correct. More mass → less acceleration.";
          fbQ2.style.color = "var(--green)";
          audio.correct();
          haptics.correct();
          haptics.applyAnimation(fbQ2, "correct");
          optsQ2
            .querySelectorAll(".option")
            .forEach((o) => (o.style.pointerEvents = "none"));
          nextBtn.style.display = "inline-block";
        } else {
          btn.classList.add("wrong");
          fbQ2.innerHTML = "✗ A heavier object is harder to accelerate.";
          fbQ2.style.color = "var(--red)";
          audio.wrong();
          haptics.wrong();
          haptics.applyAnimation(fbQ2, "wrong");
        }
      });
      optsQ2.appendChild(btn);
    });

    nextBtn.addEventListener("click", () => {
      showPhase(2);
      setupPhase2();
    });
  }

  // ========================
  // PHASE 2 – Learn the formula
  // ========================
  function setupPhase2() {
    document.getElementById("nextP2A").addEventListener("click", () => {
      const conceptBox = document.querySelector("#p2-phase2 .concept-box");
      if (conceptBox) conceptBox.style.display = "none";
      document.getElementById("nextP2A").style.display = "none";
      document.getElementById("p2-check1").style.display = "block";
      setupPhase2Check1();
    });
  }

  function setupPhase2Check1() {
    const opts = document.getElementById("optsP2Check1");
    const fb = document.getElementById("fbP2Check1");
    const nextBtn = document.getElementById("nextP2Check1");
    const choices = [
      { text: "Doubles", correct: true },
      { text: "Halves", correct: false },
      { text: "Stays the same", correct: false },
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
          fb.innerHTML = "✔ Correct! F = m × a, so doubling F doubles a.";
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
            "✗ Look at F = m × a. If F doubles and m stays the same, a must double.";
          fb.style.color = "var(--red)";
          audio.wrong();
          haptics.wrong();
          haptics.applyAnimation(fb, "wrong");
        }
      });
      opts.appendChild(btn);
    });
    nextBtn.addEventListener("click", () => {
      document.getElementById("p2-check1").style.display = "none";
      document.getElementById("p2-check2").style.display = "block";
      setupPhase2Check2();
    });
  }

  function setupPhase2Check2() {
    const opts = document.getElementById("optsP2Check2");
    const fb = document.getElementById("fbP2Check2");
    const nextBtn = document.getElementById("nextP2Check2");
    const choices = [
      { text: "Doubles", correct: false },
      { text: "Halves", correct: true },
      { text: "Stays the same", correct: false },
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
          fb.innerHTML = "✔ Correct! F = m × a, so doubling m halves a.";
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
            "✗ Look at F = m × a. If m doubles and F stays the same, a must halve.";
          fb.style.color = "var(--red)";
          audio.wrong();
          haptics.wrong();
          haptics.applyAnimation(fb, "wrong");
        }
      });
      opts.appendChild(btn);
    });
    nextBtn.addEventListener("click", () => {
      document.getElementById("p2-check2").style.display = "none";
      document.getElementById("p2-calc").style.display = "block";
      setupPhase2Calc();
    });
  }

  function setupPhase2Calc() {
    const input = document.getElementById("calcInput2");
    const check = document.getElementById("calcCheck2");
    const fb = document.getElementById("fbCalc2");
    const nextBtn = document.getElementById("nextP2Calc");
    let attempts = 0;
    check.addEventListener("click", () => {
      const val = parseFloat(input.value);
      if (val === 5) {
        fb.innerHTML = "✔ Correct! a = 10/2 = 5 m/s².";
        fb.style.color = "var(--green)";
        audio.correct();
        haptics.correct();
        haptics.applyAnimation(fb, "correct");
        addXP(20);
        nextBtn.style.display = "inline-block";
      } else {
        attempts++;
        if (attempts >= 2) {
          fb.innerHTML =
            "Hint: a = F ÷ m = 10 ÷ 2 = <strong>5 m/s²</strong>. Now type 5.";
          fb.style.color = "var(--orange)";
          // no audio/haptic on hint
        } else {
          fb.innerHTML = "✗ Not quite. Use a = F ÷ m. Try again.";
          fb.style.color = "var(--red)";
          audio.wrong();
          haptics.wrong();
          haptics.applyAnimation(fb, "wrong");
        }
      }
    });
    nextBtn.addEventListener("click", () => {
      document.getElementById("p2-calc").style.display = "none";
      document.getElementById("p2-transition").style.display = "block";
    });
    document.getElementById("nextP2").addEventListener("click", () => {
      showPhase(3);
      setupPhase3();
    });
  }

  // ========================
  // PHASE 3 – Cart Race
  // ========================
  function setupPhase3() {
    const optsQ1 = document.getElementById("optsP3Q1");
    const fbQ1 = document.getElementById("fbP3Q1");
    const q1Div = document.getElementById("p3-q1");
    const q2Div = document.getElementById("p3-q2");
    const nextBtn = document.getElementById("nextP3");
    const cartA = document.getElementById("cartA");
    const cartB = document.getElementById("cartB");
    const choices = [
      { text: "Cart A (light) wins", correct: true },
      { text: "Cart B (heavy) wins", correct: false },
      { text: "They tie", correct: false },
    ];
    choices.forEach((choice) => {
      const btn = document.createElement("div");
      btn.className = "option";
      btn.textContent = choice.text;
      btn.addEventListener("click", () => {
        optsQ1
          .querySelectorAll(".option")
          .forEach((o) => o.classList.remove("correct", "wrong"));
        if (choice.correct) {
          btn.classList.add("correct");
          fbQ1.innerHTML = "✔ Correct. Let's see the race.";
          fbQ1.style.color = "var(--green)";
          audio.correct();
          haptics.correct();
          haptics.applyAnimation(fbQ1, "correct");
        } else {
          btn.classList.add("wrong");
          fbQ1.innerHTML = "✗ Let's run the race and find out.";
          fbQ1.style.color = "var(--red)";
          audio.wrong();
          haptics.wrong();
          haptics.applyAnimation(fbQ1, "wrong");
        }
        runRace();
      });
      optsQ1.appendChild(btn);
    });

    function runRace() {
      let distA = 20,
        distB = 20;
      const finishY = 150;
      const speedA = 3,
        speedB = 1.2;
      let animFrame;
      function animateRace() {
        distA += speedA;
        distB += speedB;
        cartA.style.top = distA + "px";
        cartB.style.top = distB + "px";
        if (distA >= finishY || distB >= finishY) {
          cancelAnimationFrame(animFrame);
          q1Div.style.display = "none";
          q2Div.style.display = "block";
          setupP3Q2();
        } else {
          animFrame = requestAnimationFrame(animateRace);
        }
      }
      animateRace();
    }

    function setupP3Q2() {
      const optsQ2 = document.getElementById("optsP3Q2");
      const fbQ2 = document.getElementById("fbP3Q2");
      const choices = [
        { text: "Lighter mass → larger acceleration (F=ma)", correct: true },
        { text: "The force was bigger on Cart A", correct: false },
        { text: "Friction slowed Cart B more", correct: false },
      ];
      choices.forEach((choice) => {
        const btn = document.createElement("div");
        btn.className = "option";
        btn.textContent = choice.text;
        btn.addEventListener("click", () => {
          optsQ2
            .querySelectorAll(".option")
            .forEach((o) => o.classList.remove("correct", "wrong"));
          if (choice.correct) {
            btn.classList.add("correct");
            fbQ2.innerHTML =
              "✔ Exactly. With the same force, smaller mass yields greater acceleration.";
            fbQ2.style.color = "var(--green)";
            audio.correct();
            haptics.correct();
            haptics.applyAnimation(fbQ2, "correct");
            nextBtn.style.display = "inline-block";
          } else {
            btn.classList.add("wrong");
            fbQ2.innerHTML =
              "✗ Both carts experienced the same force. Check F=ma.";
            fbQ2.style.color = "var(--red)";
            audio.wrong();
            haptics.wrong();
            haptics.applyAnimation(fbQ2, "wrong");
          }
        });
        optsQ2.appendChild(btn);
      });
    }
    nextBtn.addEventListener("click", () => {
      showPhase(4);
      setupPhase4();
    });
  }

  // ========================
  // PHASE 4 – Rocket Transfer
  // ========================
  function setupPhase4() {
    const input = document.getElementById("rocketInput");
    const check = document.getElementById("rocketCheck");
    const fb = document.getElementById("fbRocket");
    const rocket = document.getElementById("rocket");
    const nextBtn = document.getElementById("nextP4");
    check.addEventListener("click", () => {
      const val = parseFloat(input.value);
      if (val === 20) {
        fb.innerHTML =
          "✔ Correct! a = 100 000 / 5 000 = 20 m/s². The rocket lifts off!";
        fb.style.color = "var(--green)";
        audio.correct();
        haptics.correct();
        haptics.applyAnimation(fb, "correct");
        rocket.classList.add("launching");
        addXP(30);
        nextBtn.style.display = "inline-block";
      } else {
        fb.innerHTML = "✗ Use a = F/m. Try again.";
        fb.style.color = "var(--red)";
        audio.wrong();
        haptics.wrong();
        haptics.applyAnimation(fb, "wrong");
      }
    });
    nextBtn.addEventListener("click", () => {
      showPhase(5);
      setupPhase5();
    });
  }

  // ========================
  // PHASE 5 – Summary & mastery
  // ========================
  function setupPhase5() {
    document.getElementById("nextP5").addEventListener("click", () => {
      addXP(20);
      markModuleDone("m2");
      celebrate();
      goToStep(3);
    });
  }

  // Initialize
  showPhase(1);
  setupPhase1();
}

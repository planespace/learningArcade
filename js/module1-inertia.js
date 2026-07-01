// js/module1-inertia.js

function initModule1() {
  const moduleCard = document.getElementById("module1Card");
  let userPrediction = null;
  let currentPhase = 0;

  function showPhase(num) {
    trackPhaseEnter(1, num);
    moduleCard
      .querySelectorAll(".phase")
      .forEach((p) => (p.style.display = "none"));
    const phaseDiv = document.getElementById("phase" + num);
    if (phaseDiv) phaseDiv.style.display = "block";
    currentPhase = num;
  }

  // ========================
  // PHASE 0 – Discover Inertia (interactive)
  // ========================

  function setupPhase0() {
    // ----- Step 0.1: Rest -----
    const opts1 = document.getElementById("opts0-1");
    const fb1 = document.getElementById("fb0-1");
    const next1 = document.getElementById("next0-1");
    const step1Div = document.getElementById("step0-1");
    const step2Div = document.getElementById("step0-2");

    const choices1 = [
      { text: "Yes, eventually it will move on its own", correct: false },
      { text: "No, it needs a push", correct: true },
    ];
    choices1.forEach((choice) => {
      const btn = document.createElement("div");
      btn.className = "option";
      btn.textContent = choice.text;
      btn.addEventListener("click", () => {
        // Clear previous highlights
        opts1
          .querySelectorAll(".option")
          .forEach((o) => o.classList.remove("correct", "wrong"));
        if (choice.correct) {
          btn.classList.add("correct");
          fb1.innerHTML =
            "✔ Correct. An object at rest stays at rest unless a force acts. It <strong>resists change</strong>.";
          fb1.style.color = "var(--green)";
          audio.correct();
          haptics.correct(); // ← haptic
          haptics.applyAnimation(fb1, "correct"); // ← animation
          // Only now can they proceed
          next1.style.display = "inline-block";
        } else {
          btn.classList.add("wrong");
          fb1.innerHTML =
            "✗ No — objects don't move by themselves. A force is needed. The puck <strong>resists change</strong>.";
          fb1.style.color = "var(--red)";
          audio.wrong();
          haptics.wrong(); // ← haptic
          haptics.applyAnimation(fb1, "wrong"); // ← animation
          // Next button stays hidden – they must try again
        }
      });
      opts1.appendChild(btn);
    });

    next1.addEventListener("click", () => {
      step1Div.style.display = "none";
      step2Div.style.display = "block";
      startStep0_2();
    });

    // ----- Step 0.2: Motion -----
    function startStep0_2() {
      const track = document.getElementById("track0-2");
      const arrowContainer = document.getElementById("arrow0-2");
      const opts2 = document.getElementById("opts0-2");
      const fb2 = document.getElementById("fb0-2");
      const next2 = document.getElementById("next0-2");
      const step2Div = document.getElementById("step0-2");
      const step3Div = document.getElementById("step0-3");

      const arrow = document.createElement("div");
      arrow.className = "direction-arrow right";
      arrow.textContent = "➡️";
      arrow.style.display = "block";
      arrowContainer.appendChild(arrow);

      let velocity = 2;
      const SPEED = 1.5;
      const TILE = 40;
      let animFrame;

      track.style.backgroundImage =
        "radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)";
      track.style.backgroundSize = "40px 40px";
      track.style.backgroundRepeat = "repeat";
      track.style.backgroundPosition = "0 0";

      function animate() {
        let x = parseFloat(track.style.backgroundPositionX) || 0;
        x -= velocity * SPEED;
        x = ((x % TILE) + TILE) % TILE;
        track.style.backgroundPosition = x + "px 0";
        animFrame = requestAnimationFrame(animate);
      }
      animate();

      const choices2 = [
        { text: "It slows down and stops", correct: false },
        { text: "It keeps moving at the same speed", correct: true },
        { text: "It stops immediately", correct: false },
      ];
      choices2.forEach((choice) => {
        const btn = document.createElement("div");
        btn.className = "option";
        btn.textContent = choice.text;
        btn.addEventListener("click", () => {
          opts2
            .querySelectorAll(".option")
            .forEach((o) => o.classList.remove("correct", "wrong"));
          if (choice.correct) {
            btn.classList.add("correct");
            fb2.innerHTML =
              "✔ Exactly. A moving object stays in motion at constant speed unless a force acts. It <strong>resists change</strong>.";
            fb2.style.color = "var(--green)";
            audio.correct();
            haptics.correct(); // ← haptic
            haptics.applyAnimation(fb2, "correct"); // ← animation
            next2.style.display = "inline-block";
          } else {
            btn.classList.add("wrong");
            fb2.innerHTML =
              "✗ Without friction or any force, motion never stops. The puck keeps its velocity — it <strong>resists change</strong>.";
            fb2.style.color = "var(--red)";
            audio.wrong();
            haptics.wrong(); // ← haptic
            haptics.applyAnimation(fb2, "wrong"); // ← animation
            // Next stays hidden
          }
        });
        opts2.appendChild(btn);
      });

      next2.addEventListener("click", () => {
        cancelAnimationFrame(animFrame);
        step2Div.style.display = "none";
        step3Div.style.display = "block";
        startStep0_3();
      });
    }

    // ----- Step 0.3: Synthesis -----
    function startStep0_3() {
      const track3 = document.getElementById("track0-3");
      const arrowContainer3 = document.getElementById("arrow0-3");
      const arrow3 = document.createElement("div");
      arrow3.className = "direction-arrow right";
      arrow3.textContent = "➡️";
      arrow3.style.display = "block";
      arrowContainer3.appendChild(arrow3);

      let velocity = 2;
      const SPEED = 1.5;
      const TILE = 40;
      track3.style.backgroundImage =
        "radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)";
      track3.style.backgroundSize = "40px 40px";
      track3.style.backgroundRepeat = "repeat";
      track3.style.backgroundPosition = "0 0";

      function animate() {
        let x = parseFloat(track3.style.backgroundPositionX) || 0;
        x -= velocity * SPEED;
        x = ((x % TILE) + TILE) % TILE;
        track3.style.backgroundPosition = x + "px 0";
        requestAnimationFrame(animate);
      }
      animate();

      document.getElementById("nextPhase0").addEventListener("click", () => {
        showPhase(1);
        setupPhase1();
      });
    }
  }

  // ========================
  // PHASE 1 – Predict
  // ========================
  function setupPhase1() {
    const opts = document.getElementById("optsPhase1");
    const fb = document.getElementById("fbPhase1");

    const choices = [
      {
        text: "It slides a short distance, then slows down and stops",
        correct: false,
      },
      { text: "It keeps moving at the same speed indefinitely", correct: true },
      { text: "It stops the moment your hand leaves it", correct: false },
    ];

    choices.forEach((choice, i) => {
      const btn = document.createElement("div");
      btn.className = "option";
      btn.textContent = choice.text;
      btn.addEventListener("click", () => {
        opts
          .querySelectorAll(".option")
          .forEach((o) => o.classList.remove("correct", "wrong"));
        btn.classList.add("selected");
        userPrediction = i;
        fb.innerHTML = "Good. Now test it. →";
        fb.style.color = "var(--teal)";

        setTimeout(() => {
          showPhase(2);
          setupPhase2();
        }, 800);
      });
      opts.appendChild(btn);
    });
  }

  // ========================
  // PHASE 2 – Test (Push Once)
  // ========================
  let phase2AnimFrame;
  function setupPhase2() {
    const track = document.getElementById("trackPhase2");
    const arrowContainer = document.getElementById("arrowPhase2");
    const msg = document.getElementById("simMsgPhase2");
    const nextBtn = document.getElementById("nextPhase2");

    const arrow = document.createElement("div");
    arrow.className = "direction-arrow right";
    arrow.textContent = "➡️";
    arrow.style.display = "none";
    arrowContainer.appendChild(arrow);

    let velocity = 0;
    const SPEED = 1.5;
    const TILE = 40;

    track.style.backgroundImage =
      "radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)";
    track.style.backgroundSize = "40px 40px";
    track.style.backgroundRepeat = "repeat";
    track.style.backgroundPosition = "0 0";

    function animate() {
      if (velocity !== 0) {
        let x = parseFloat(track.style.backgroundPositionX) || 0;
        x -= velocity * SPEED;
        x = ((x % TILE) + TILE) % TILE;
        track.style.backgroundPosition = x + "px 0";
      }
      phase2AnimFrame = requestAnimationFrame(animate);
    }
    animate();

    function updateArrow() {
      if (velocity > 0) arrow.style.display = "block";
      else arrow.style.display = "none";
    }

    document.getElementById("btnPushOnce2").addEventListener("click", () => {
      velocity = 2;
      updateArrow();
      msg.innerHTML =
        "The puck moves at constant speed. It <strong>does not slow down</strong>. It <strong>does not stop</strong>. This is inertia — an object maintains its motion unless a force acts on it.";
      msg.style.color = "var(--teal)";
      audio.forceApply(); // 🎵 PHYSICS SOUND
      document.getElementById("btnPushOnce2").disabled = true;
      nextBtn.style.display = "inline-block";
    });

    nextBtn.addEventListener("click", () => {
      cancelAnimationFrame(phase2AnimFrame);
      showPhase(3);
      setupPhase3();
    });
  }

  // ========================
  // PHASE 3 – Compare
  // ========================
  function setupPhase3() {
    const track = document.getElementById("trackPhase3");
    const arrowContainer = document.getElementById("arrowPhase3");
    const msg = document.getElementById("simMsgPhase3");
    const compareBox = document.getElementById("compareBox");

    const arrow = document.createElement("div");
    arrow.className = "direction-arrow right";
    arrow.textContent = "➡️";
    arrow.style.display = "block";
    arrowContainer.appendChild(arrow);

    let velocity = 2;
    const SPEED = 1.5;
    const TILE = 40;
    track.style.backgroundImage =
      "radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)";
    track.style.backgroundSize = "40px 40px";
    track.style.backgroundRepeat = "repeat";
    track.style.backgroundPosition = "0 0";

    function animate() {
      if (velocity !== 0) {
        let x = parseFloat(track.style.backgroundPositionX) || 0;
        x -= velocity * SPEED;
        x = ((x % TILE) + TILE) % TILE;
        track.style.backgroundPosition = x + "px 0";
      }
      requestAnimationFrame(animate);
    }
    animate();

    const predictions = [
      "It slides a short distance, then slows down and stops",
      "It keeps moving at the same speed indefinitely",
      "It stops the moment your hand leaves it",
    ];
    const theirPrediction =
      userPrediction !== null
        ? predictions[userPrediction]
        : "No prediction made";

    if (userPrediction === 1) {
      compareBox.innerHTML = `
                <p>You predicted: <em>"${theirPrediction}"</em></p>
                <p style="margin-top:0.5rem;">✔ <strong>That's correct.</strong> Without a force to stop it, the puck maintains its motion. You've grasped inertia.</p>
            `;
    } else {
      compareBox.innerHTML = `
                <p>You predicted: <em>"${theirPrediction}"</em></p>
                <p style="margin-top:0.5rem;">Most people make the same prediction — because on Earth, <strong>friction</strong> slows everything down. But this track has no friction. Without any force opposing it, the puck simply continues. <strong>That's inertia.</strong></p>
            `;
    }

    msg.innerHTML =
      "The puck is still moving. It will keep moving until a force acts on it.";
    msg.style.color = "var(--teal)";

    document.getElementById("nextPhase3").addEventListener("click", () => {
      showPhase(4);
      setupPhase4();
    });
  }

  // ========================
  // PHASE 4 – Playground (with longer explanations)
  // ========================
  function setupPhase4() {
    const track = document.getElementById("trackPhase4");
    const arrowContainer = document.getElementById("arrowPhase4");
    const msg = document.getElementById("simMsgPhase4");

    const arrow = document.createElement("div");
    arrow.className = "direction-arrow";
    arrowContainer.appendChild(arrow);

    let velocity = 0;
    const SPEED = 1.5;
    const TILE = 40;

    track.style.backgroundImage =
      "radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)";
    track.style.backgroundSize = "40px 40px";
    track.style.backgroundRepeat = "repeat";
    track.style.backgroundPosition = "0 0";

    function updateArrow() {
      if (velocity > 0) {
        arrow.textContent = "➡️";
        arrow.className = "direction-arrow right";
        arrow.style.display = "block";
      } else if (velocity < 0) {
        arrow.textContent = "⬅️";
        arrow.className = "direction-arrow left";
        arrow.style.display = "block";
      } else {
        arrow.style.display = "none";
        arrow.className = "direction-arrow";
      }
    }

    function animate() {
      if (velocity !== 0) {
        let x = parseFloat(track.style.backgroundPositionX) || 0;
        x -= velocity * SPEED;
        x = ((x % TILE) + TILE) % TILE;
        track.style.backgroundPosition = x + "px 0";
      }
      updateArrow();
      requestAnimationFrame(animate);
    }
    animate();

    function setMsg(text, color) {
      msg.innerHTML = text;
      msg.style.color = color || "var(--white)";
    }

    document.getElementById("btnPush4").addEventListener("click", () => {
      velocity = 2;
      setMsg(
        "You applied a force to the right. The puck accelerates briefly and now moves at constant speed. Because there is no friction, inertia keeps it moving without any further pushes.",
        "var(--teal)"
      );
      audio.forceApply(); // 🎵 PHYSICS SOUND
    });

    document.getElementById("btnOppose4").addEventListener("click", () => {
      if (velocity === 0) {
        setMsg("The puck is at rest. Apply a force first.", "var(--orange)");
        return;
      }
      velocity = -velocity;
      setMsg(
        "You applied an opposing force. This changes the direction of motion. Inertia now maintains the new direction at constant speed.",
        "var(--teal)"
      );
      audio.forceApply(); // 🎵 PHYSICS SOUND
    });

    document.getElementById("btnRemove4").addEventListener("click", () => {
      if (velocity === 0) {
        setMsg(
          "The puck is already at rest. No forces are acting on it.",
          "var(--white)"
        );
      } else {
        setMsg(
          "All forces are removed. The puck continues with its current velocity — same speed, same direction. That is inertia in action.",
          "var(--teal)"
        );
      }
    });

    document.getElementById("nextPhase4").addEventListener("click", () => {
      showPhase(5);
      setupPhase5();
    });
  }

  // ========================
  // PHASE 5 – Prove (Spaceship)
  // ========================
  function setupPhase5() {
    const spaceship = document.getElementById("spaceship");
    const opts = document.getElementById("optsPhase5");
    opts.innerHTML = "";
    const fb = document.getElementById("fbPhase5");
    const nextBtn = document.getElementById("nextPhase5");

    const choices = [
      {
        text: "The ship keeps gliding at the same speed forever",
        correct: true,
      },
      {
        text: "The ship gradually slows down and drifts to a stop",
        correct: false,
      },
      { text: "The ship stops almost immediately", correct: false },
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
            "✔ <strong>Exactly.</strong> In space, no forces slow the ship. Inertia keeps it going at constant speed. +50 XP";
          fb.style.color = "var(--green)";
          audio.correct();
          haptics.correct();
          haptics.applyAnimation(fb, "correct");
          spaceship.classList.add("drifting");
          addXP(50);
          audio.rocketLaunch(); // 🎵 PHYSICS SOUND
          markModuleDone("m1");
          nextBtn.style.display = "inline-block";
          celebrate();
        } else {
          btn.classList.add("wrong");
          fb.innerHTML =
            "✗ <strong>Not quite.</strong> In space there is nothing to slow it down. Remember the puck — it kept moving without any force. Try again.";
          fb.style.color = "var(--red)";
          audio.wrong();
          haptics.wrong();
          haptics.applyAnimation(fb, "wrong");
        }
      });
      opts.appendChild(btn);
    });

    nextBtn.addEventListener("click", () => {
      goToStep(2);
    });
  }

  // Initialize
  showPhase(0);
  setupPhase0();
}

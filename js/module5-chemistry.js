// js/module5-chemistry.js

function initModule5() {
  const moduleCard = document.getElementById("module5Card");

  function showStep(stepId) {
    const phase0 = document.getElementById("c-phase0");
    if (!phase0) return;
    phase0
      .querySelectorAll("[id^='c-step0-'], [id^='c-q']")
      .forEach((el) => (el.style.display = "none"));
    const target = document.getElementById(stepId);
    if (target) target.style.display = "block";
    target.scrollIntoView({ behavior: "smooth", block: "center" });

    // Save the current chemistry sub-step
    CONFIG.chemistryStep = stepId;
    saveState();
  }

  // ----- Atom rendering -----
  function renderAllAtoms() {
    document
      .querySelectorAll(".electron-orbits[data-shells]")
      .forEach((orbitsDiv) => {
        const shells = orbitsDiv.dataset.shells.split(",").map(Number);
        const highlightOuter = orbitsDiv.dataset.highlight === "outer";
        const missingSlot = orbitsDiv.dataset.missing === "outer";
        orbitsDiv.innerHTML = "";

        shells.forEach((count, idx) => {
          const ring = document.createElement("div");
          ring.className = "orbit-ring";
          const radius = 38 + idx * 26;
          ring.style.width = radius * 2 + "px";
          ring.style.height = radius * 2 + "px";
          ring.style.position = "absolute";
          ring.style.top = "50%";
          ring.style.left = "50%";
          ring.style.transform = "translate(-50%, -50%)";
          ring.style.border = "1px solid rgba(255,255,255,0.3)";
          ring.style.borderRadius = "50%";

          for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            const dot = document.createElement("div");
            dot.className = "electron-dot";
            dot.style.position = "absolute";
            dot.style.left = "50%";
            dot.style.top = "50%";
            dot.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
            if (
              highlightOuter &&
              idx === shells.length - 1 &&
              i === count - 1
            ) {
              dot.classList.add("gold");
              dot.id = "draggableElectron";
            }
            ring.appendChild(dot);
          }

          if (missingSlot && idx === shells.length - 1) {
            const angle = -Math.PI / 2;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            const slot = document.createElement("div");
            slot.className = "electron-dot empty-slot";
            slot.id = "clTargetZone";
            slot.style.position = "absolute";
            slot.style.left = "50%";
            slot.style.top = "50%";
            slot.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
            ring.appendChild(slot);
          }
          orbitsDiv.appendChild(ring);
        });
      });
  }

  // ---- Step 0.1 – What is an atom? ----
  function setupStep0_1() {
    const opts = document.getElementById("optsCS1");
    const fb = document.getElementById("fbCS1");
    const next = document.getElementById("nextCS1");
    opts.innerHTML = "";
    const choices = [
      { text: "An atom", correct: true },
      { text: "A molecule", correct: false },
      { text: "A grain of sand", correct: false },
    ];
    choices.forEach((c) => {
      const btn = document.createElement("div");
      btn.className = "option";
      btn.textContent = c.text;
      btn.addEventListener("click", () => {
        opts
          .querySelectorAll(".option")
          .forEach((o) => o.classList.remove("correct", "wrong"));
        if (c.correct) {
          btn.classList.add("correct");
          fb.innerHTML =
            "✔ Correct! That smallest piece is an <strong>atom</strong>.";
          fb.style.color = "var(--green)";
          audio.correct();
          haptics.correct();
          haptics.applyAnimation(fb, "correct");
          next.style.display = "inline-block";
        } else {
          btn.classList.add("wrong");
          fb.innerHTML =
            "✗ Not quite. Think smaller – the smallest unit of an element.";
          fb.style.color = "var(--red)";
          audio.wrong();
          haptics.wrong();
          haptics.applyAnimation(fb, "wrong");
        }
      });
      opts.appendChild(btn);
    });
    next.addEventListener("click", () => {
      showStep("c-step0-2");
      setupStep0_2();
    });
  }

  // ---- Step 0.2 – Inside the atom (robust event delegation) ----
  function setupStep0_2() {
    renderAllAtoms();
    const container = document.getElementById("introAtomContainer");
    const feedbackBox = document.getElementById("atomFeedbackBox");
    const quizDiv = document.getElementById("q-step0-2");

    let nucleusTapped = false;
    let electronTapped = false;
    let quizShown = false;

    function setFeedback(html, color = "var(--white)") {
      feedbackBox.innerHTML = html;
      feedbackBox.style.color = color;
    }

    // One click listener for the whole container – catches everything
    container.addEventListener("click", function (e) {
      const target = e.target;

      // 1. Clicked the nucleus?
      if (target === container.querySelector(".atom-core")) {
        // Visual feedback
        target.style.transition = "0.2s";
        target.style.transform = "translate(-50%, -50%) scale(1.3)";
        setTimeout(() => {
          target.style.transform = "translate(-50%, -50%) scale(1)";
        }, 200);
        setFeedback(
          "✔ <strong>Nucleus</strong> – contains <strong>protons</strong> (+) and <strong>neutrons</strong> (neutral).",
          "var(--green)"
        );
        audio.atomTap(); // 🎵 SOUND
        audio.correct();
        if (!nucleusTapped) {
          nucleusTapped = true;
          checkBothTapped();
        }
        return;
      }

      // 2. Clicked an electron dot?
      if (target.classList.contains("electron-dot")) {
        // Reset all electrons to white
        container.querySelectorAll(".electron-dot").forEach((el) => {
          el.style.background = "#fff";
          el.style.boxShadow = "0 0 5px rgba(255,255,255,0.5)";
        });
        // Highlight the clicked one
        target.style.background = "var(--teal)";
        target.style.boxShadow = "0 0 18px var(--teal)";
        setFeedback(
          "✔ <strong>Electron</strong> – negatively charged (−), orbits the nucleus.",
          "var(--green)"
        );
        audio.atomTap(); // 🎵 SOUND
        audio.correct();
        if (!electronTapped) {
          electronTapped = true;
          checkBothTapped();
        }
      }
    });

    function checkBothTapped() {
      if (nucleusTapped && electronTapped && !quizShown) {
        quizShown = true;
        setTimeout(() => {
          quizDiv.style.display = "block";
          setupStep0_2_Quiz();
        }, 600);
      }
    }

    function setupStep0_2_Quiz() {
      const opts = document.getElementById("optsCS2");
      const fb = document.getElementById("fbCS2");
      const next = document.getElementById("nextCS2");
      opts.innerHTML = "";
      const choices = [
        { text: "Protons and neutrons", correct: true },
        { text: "Electrons only", correct: false },
        { text: "Protons and electrons", correct: false },
      ];
      choices.forEach((c) => {
        const btn = document.createElement("div");
        btn.className = "option";
        btn.textContent = c.text;
        btn.addEventListener("click", () => {
          opts
            .querySelectorAll(".option")
            .forEach((o) => o.classList.remove("correct", "wrong"));
          if (c.correct) {
            btn.classList.add("correct");
            fb.innerHTML =
              "✔ Exactly! The nucleus contains protons and neutrons.";
            fb.style.color = "var(--green)";
            audio.correct();
            haptics.correct();
            haptics.applyAnimation(fb, "correct");
            next.style.display = "inline-block";
          } else {
            btn.classList.add("wrong");
            fb.innerHTML =
              "✗ The nucleus has protons and neutrons; electrons orbit around it.";
            fb.style.color = "var(--red)";
            audio.wrong();
            haptics.wrong();
            haptics.applyAnimation(fb, "wrong");
          }
        });
        opts.appendChild(btn);
      });
      next.addEventListener("click", () => {
        showStep("c-step0-3");
        setupStep0_3();
      });
    }
  }

  // ---- Step 0.3 – Duplet Rule (discovery) ----
  function setupStep0_3() {
    renderAllAtoms();
    const abContainer = document.getElementById("step03-ab");
    const cContainer = document.getElementById("step03-c");
    const ruleBox = document.getElementById("dupletRuleBox");

    // Show only A/B initially
    abContainer.style.display = "block";
    cContainer.style.display = "none";
    ruleBox.style.display = "none";

    // Part A: count electrons in Helium
    const optsA = document.getElementById("optsCS3a");
    const fbA = document.getElementById("fbCS3a");
    const nextA = document.getElementById("nextCS3a");
    optsA.innerHTML = "";
    const choicesA = [
      { text: "1", correct: false },
      { text: "2", correct: true },
      { text: "8", correct: false },
    ];
    choicesA.forEach((c) => {
      const btn = document.createElement("div");
      btn.className = "option";
      btn.textContent = c.text;
      btn.addEventListener("click", () => {
        optsA
          .querySelectorAll(".option")
          .forEach((o) => o.classList.remove("correct", "wrong"));
        if (c.correct) {
          btn.classList.add("correct");
          fbA.innerHTML = "✔ Helium has 2 electrons in its first shell.";
          fbA.style.color = "var(--green)";
          audio.correct();
          haptics.correct();
          haptics.applyAnimation(fbA, "correct");
          nextA.style.display = "inline-block";
        } else {
          btn.classList.add("wrong");
          fbA.innerHTML = "✗ Count the dots around Helium – there are 2.";
          fbA.style.color = "var(--red)";
          audio.wrong();
          haptics.wrong();
          haptics.applyAnimation(fbA, "wrong");
        }
      });
      optsA.appendChild(btn);
    });
    nextA.addEventListener("click", () => {
      document.getElementById("q3a").style.display = "none";
      document.getElementById("q3b").style.display = "block";
      setupPartB();
    });

    // Part B: is the shell full?
    function setupPartB() {
      const optsB = document.getElementById("optsCS3b");
      const fbB = document.getElementById("fbCS3b");
      const nextB = document.getElementById("nextCS3b");
      optsB.innerHTML = "";
      const choicesB = [
        { text: "Yes, it's full", correct: true },
        { text: "No, it could hold more", correct: false },
      ];
      choicesB.forEach((c) => {
        const btn = document.createElement("div");
        btn.className = "option";
        btn.textContent = c.text;
        btn.addEventListener("click", () => {
          optsB
            .querySelectorAll(".option")
            .forEach((o) => o.classList.remove("correct", "wrong"));
          if (c.correct) {
            btn.classList.add("correct");
            fbB.innerHTML =
              "✔ Correct – the first shell is completely full with 2 electrons.";
            fbB.style.color = "var(--green)";
            audio.correct();
            haptics.correct();
            haptics.applyAnimation(fbB, "correct");
            nextB.style.display = "inline-block";
          } else {
            btn.classList.add("wrong");
            fbB.innerHTML =
              "✗ Look again: Helium's first shell is full with 2 electrons.";
            fbB.style.color = "var(--red)";
            audio.wrong();
            haptics.wrong();
            haptics.applyAnimation(fbB, "wrong");
          }
        });
        optsB.appendChild(btn);
      });
      nextB.addEventListener("click", () => {
        // Switch to lithium view
        abContainer.style.display = "none";
        cContainer.style.display = "block";
        renderAllAtoms(); // render lithium atom
        setupPartC();
      });
    }

    // Part C: Lithium example
    function setupPartC() {
      const optsC = document.getElementById("optsCS3c");
      const fbC = document.getElementById("fbCS3c");
      const nextC = document.getElementById("nextCS3c");
      optsC.innerHTML = "";
      const choicesC = [
        { text: "The first shell can only hold 2 electrons", correct: true },
        { text: "It's too heavy", correct: false },
        { text: "It doesn't like the first shell", correct: false },
      ];
      choicesC.forEach((c) => {
        const btn = document.createElement("div");
        btn.className = "option";
        btn.textContent = c.text;
        btn.addEventListener("click", () => {
          optsC
            .querySelectorAll(".option")
            .forEach((o) => o.classList.remove("correct", "wrong"));
          if (c.correct) {
            btn.classList.add("correct");
            fbC.innerHTML =
              "✔ Exactly! The first shell can only hold 2 electrons – the Duplet Rule.";
            fbC.style.color = "var(--green)";
            audio.correct();
            haptics.correct();
            haptics.applyAnimation(fbC, "correct");
            ruleBox.style.display = "block";
            nextC.style.display = "inline-block";
          } else {
            btn.classList.add("wrong");
            fbC.innerHTML =
              "✗ Remember Helium – the first shell was full at 2 electrons.";
            fbC.style.color = "var(--red)";
            audio.wrong();
            haptics.wrong();
            haptics.applyAnimation(fbC, "wrong");
          }
        });
        optsC.appendChild(btn);
      });
      nextC.addEventListener("click", () => {
        showStep("c-step0-4");
        setupStep0_4();
      });
    }
  }

  // ---- Step 0.4 – Octet Rule (discovery) ----
  function setupStep0_4() {
    renderAllAtoms();
    const qaDiv = document.getElementById("q4a");
    const qbDiv = document.getElementById("q4b");
    const qcDiv = document.getElementById("q4c");
    qaDiv.style.display = "block";
    qbDiv.style.display = "none";
    qcDiv.style.display = "none";

    // Part A: count outer electrons in Neon
    const optsA = document.getElementById("optsCS4a");
    const fbA = document.getElementById("fbCS4a");
    const nextA = document.getElementById("nextCS4a");
    optsA.innerHTML = "";
    const choicesA = [
      { text: "2", correct: false },
      { text: "8", correct: true },
      { text: "10", correct: false },
    ];
    choicesA.forEach((c) => {
      const btn = document.createElement("div");
      btn.className = "option";
      btn.textContent = c.text;
      btn.addEventListener("click", () => {
        optsA
          .querySelectorAll(".option")
          .forEach((o) => o.classList.remove("correct", "wrong"));
        if (c.correct) {
          btn.classList.add("correct");
          fbA.innerHTML = "✔ Neon has 8 electrons in its outer shell.";
          fbA.style.color = "var(--green)";
          audio.correct();
          haptics.correct();
          haptics.applyAnimation(fbA, "correct");
          nextA.style.display = "inline-block";
        } else {
          btn.classList.add("wrong");
          fbA.innerHTML =
            "✗ Count the dots on the outermost ring – there are 8.";
          fbA.style.color = "var(--red)";
          audio.wrong();
          haptics.wrong();
          haptics.applyAnimation(fbA, "wrong");
        }
      });
      optsA.appendChild(btn);
    });
    nextA.addEventListener("click", () => {
      qaDiv.style.display = "none";
      qbDiv.style.display = "block";
      setupPartB();
    });

    // Part B: is the outer shell full?
    function setupPartB() {
      const optsB = document.getElementById("optsCS4b");
      const fbB = document.getElementById("fbCS4b");
      const nextB = document.getElementById("nextCS4b");
      optsB.innerHTML = "";
      const choicesB = [
        { text: "Yes, it's completely full", correct: true },
        { text: "No, it could hold more", correct: false },
      ];
      choicesB.forEach((c) => {
        const btn = document.createElement("div");
        btn.className = "option";
        btn.textContent = c.text;
        btn.addEventListener("click", () => {
          optsB
            .querySelectorAll(".option")
            .forEach((o) => o.classList.remove("correct", "wrong"));
          if (c.correct) {
            btn.classList.add("correct");
            fbB.innerHTML =
              "✔ Correct. Neon's outer shell is full with 8 electrons.";
            fbB.style.color = "var(--green)";
            audio.correct();
            haptics.correct();
            haptics.applyAnimation(fbB, "correct");
            nextB.style.display = "inline-block";
          } else {
            btn.classList.add("wrong");
            fbB.innerHTML =
              "✗ Look again – there are 8 electrons, the shell is completely full.";
            fbB.style.color = "var(--red)";
            audio.wrong();
            haptics.wrong();
            haptics.applyAnimation(fbB, "wrong");
          }
        });
        optsB.appendChild(btn);
      });
      nextB.addEventListener("click", () => {
        qbDiv.style.display = "none";
        qcDiv.style.display = "block";
        setupPartC();
      });
    }

    // Part C: interactive builder
    function setupPartC() {
      const builder = document.getElementById("octetBuilder");
      const msg = document.getElementById("octetMsg");
      const nextC = document.getElementById("nextCS4c");
      const ruleBox = document.getElementById("octetRuleBox");
      let electronsPlaced = 0;
      builder.innerHTML = "";

      for (let i = 0; i < 8; i++) {
        const btn = document.createElement("div");
        btn.className = "octet-electron-btn";
        btn.textContent = "+";
        btn.addEventListener("click", () => {
          if (electronsPlaced < 8) {
            electronsPlaced++;
            btn.textContent = "●";
            btn.classList.add("filled");
            audio.octetAdd(); // 🎵 SOUND – pop when adding electron
          }
          if (electronsPlaced === 8) {
            msg.innerHTML = "Outer shell full! Can't add a ninth electron.";
            msg.style.color = "var(--teal)";
            nextC.style.display = "inline-block";
            ruleBox.style.display = "block";
            audio.octetFull(); // 🎵 SOUND – fanfare when octet complete
            document
              .querySelectorAll(".octet-electron-btn")
              .forEach((b) => (b.style.pointerEvents = "none"));
          }
        });
        builder.appendChild(btn);
      }

      nextC.addEventListener("click", () => {
        showStep("c-step0-5");
        setupStep0_5();
      });
    }
  }

  // ---- Step 0.5 – Stability ----
  function setupStep0_5() {
    renderAllAtoms();
    const opts = document.getElementById("optsCS5");
    const fb = document.getElementById("fbCS5");
    const next = document.getElementById("nextCS5");
    opts.innerHTML = "";
    const choices = [
      { text: "Neon (Ne)", correct: true },
      { text: "Sodium (Na)", correct: false },
      { text: "Both are equal", correct: false },
    ];
    choices.forEach((c) => {
      const btn = document.createElement("div");
      btn.className = "option";
      btn.textContent = c.text;
      btn.addEventListener("click", () => {
        opts
          .querySelectorAll(".option")
          .forEach((o) => o.classList.remove("correct", "wrong"));
        if (c.correct) {
          btn.classList.add("correct");
          fb.innerHTML = "✔ Neon has a full outer shell – it is stable.";
          fb.style.color = "var(--green)";
          audio.correct();
          haptics.correct();
          haptics.applyAnimation(fb, "correct");
          next.style.display = "inline-block";
        } else {
          btn.classList.add("wrong");
          fb.innerHTML = "✗ Look at their outer shells – which one is full?";
          fb.style.color = "var(--red)";
          audio.wrong();
          haptics.wrong();
          haptics.applyAnimation(fb, "wrong");
        }
      });
      opts.appendChild(btn);
    });
    next.addEventListener("click", () => {
      showStep("c-step0-6");
      setupStep0_6();
    });
  }

  // ---- Step 0.6 – Lose or Gain? ----
  function setupStep0_6() {
    // Part a – sodium
    const qa = document.getElementById("q6a");
    const qb = document.getElementById("q6b");
    qa.style.display = "block";
    qb.style.display = "none";
    const optsA = document.getElementById("optsCS6a");
    const fbA = document.getElementById("fbCS6a");
    const nextA = document.getElementById("nextCS6a");
    optsA.innerHTML = "";
    const choicesA = [
      { text: "Lose 1 electron", correct: true },
      { text: "Gain 7 electrons", correct: false },
      { text: "Do nothing", correct: false },
    ];
    choicesA.forEach((c) => {
      const btn = document.createElement("div");
      btn.className = "option";
      btn.textContent = c.text;
      btn.addEventListener("click", () => {
        optsA
          .querySelectorAll(".option")
          .forEach((o) => o.classList.remove("correct", "wrong"));
        if (c.correct) {
          btn.classList.add("correct");
          fbA.innerHTML =
            "✔ Correct! Sodium loses 1 electron to get a full outer shell.";
          fbA.style.color = "var(--green)";
          audio.correct();
          haptics.correct();
          haptics.applyAnimation(fbA, "correct");
          nextA.style.display = "inline-block";
        } else {
          btn.classList.add("wrong");
          fbA.innerHTML =
            "✗ It has 1 outer electron – losing it is much easier.";
          fbA.style.color = "var(--red)";
          audio.wrong();
          haptics.wrong();
          haptics.applyAnimation(fbA, "wrong");
        }
      });
      optsA.appendChild(btn);
    });
    nextA.addEventListener("click", () => {
      qa.style.display = "none";
      qb.style.display = "block";
      setupStep0_6b();
    });
  }

  function setupStep0_6b() {
    const optsB = document.getElementById("optsCS6b");
    const fbB = document.getElementById("fbCS6b");
    const nextB = document.getElementById("nextCS6b");
    const ionBox = document.getElementById("ionIntroBox");
    optsB.innerHTML = "";
    const choicesB = [
      { text: "Gain 1 electron", correct: true },
      { text: "Lose 7 electrons", correct: false },
      { text: "Do nothing", correct: false },
    ];
    choicesB.forEach((c) => {
      const btn = document.createElement("div");
      btn.className = "option";
      btn.textContent = c.text;
      btn.addEventListener("click", () => {
        optsB
          .querySelectorAll(".option")
          .forEach((o) => o.classList.remove("correct", "wrong"));
        if (c.correct) {
          btn.classList.add("correct");
          fbB.innerHTML =
            "✔ Exactly! Chlorine gains 1 electron to fill its outer shell.";
          fbB.style.color = "var(--green)";
          audio.correct();
          haptics.correct();
          haptics.applyAnimation(fbB, "correct");
          ionBox.style.display = "block";
          nextB.style.display = "inline-block";
        } else {
          btn.classList.add("wrong");
          fbB.innerHTML =
            "✗ Chlorine has 7 – adding 1 is much simpler than losing 7.";
          fbB.style.color = "var(--red)";
          audio.wrong();
          haptics.wrong();
          haptics.applyAnimation(fbB, "wrong");
        }
      });
      optsB.appendChild(btn);
    });
    nextB.addEventListener("click", () => {
      showStep("c-step0-7");
      setupStep0_7();
    });
  }

  // ---- Step 0.7 – Electron Transfer (instant, shows Next button) ----
  function setupStep0_7() {
    renderAllAtoms();

    const btnTransfer = document.getElementById("transferBtn");
    const msg = document.getElementById("simMsgC7");
    const nextBtn = document.getElementById("nextAfterTransfer");
    let transferred = false;

    if (!btnTransfer || !nextBtn) return;

    btnTransfer.addEventListener("click", () => {
      if (transferred) return;
      transferred = true;
      btnTransfer.disabled = true;
      btnTransfer.textContent = "Transferred!";
      btnTransfer.style.opacity = "0.7";

      requestAnimationFrame(() => {
        const electron = document.getElementById("draggableElectron");
        const naContainer = document.getElementById("naContainer7");
        const clContainer = document.getElementById("clContainer7");
        const clOrbits = clContainer?.querySelector(".electron-orbits");

        if (!electron || !clOrbits) {
          msg.innerHTML = "⚠️ Something went wrong. Please refresh.";
          return;
        }

        // Hide sodium's outer electron
        electron.style.display = "none";

        // Place a gold dot on chlorine's outer shell
        const shells = clOrbits.dataset.shells.split(",").map(Number);
        const outerIndex = shells.length - 1;
        const outerRing = clOrbits.children[outerIndex];
        if (!outerRing) return;

        const radius = 38 + outerIndex * 26;
        const angle = -Math.PI / 2;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        const finalDot = document.createElement("div");
        finalDot.className = "electron-dot gold";
        finalDot.style.position = "absolute";
        finalDot.style.left = "50%";
        finalDot.style.top = "50%";
        finalDot.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
        finalDot.style.width = "14px";
        finalDot.style.height = "14px";
        finalDot.style.background = "gold";
        finalDot.style.boxShadow = "0 0 10px gold";
        outerRing.appendChild(finalDot);

        naContainer.classList.add("ion-positive");
        clContainer.classList.add("ion-negative");

        msg.innerHTML = "✓ Electron transferred! Na⁺ and Cl⁻ formed.";
        msg.style.color = "var(--green)";
        audio.electronTransfer(); // 🎵 SOUND – whoosh + rising chime
        haptics.correct();
        haptics.applyAnimation(msg, "correct");

        // Show the Next button
        nextBtn.style.display = "inline-block";
        nextBtn.scrollIntoView({ behavior: "smooth", block: "center" });
      });
    });

    // Next button goes to step0-8
    nextBtn.addEventListener("click", () => {
      showStep("c-step0-8");
      setupStep0_8();
    });
  }

  // ---- Step 0.8 – Interactive Ion Discovery (7 stations) ----
  function setupStep0_8() {
    const card = document.getElementById("ionStationCard");
    const concept = document.getElementById("ionStationConcept");
    const nextBtn = document.getElementById("ionStationNext");

    if (!card || !concept || !nextBtn) return;

    // ---------- Helper: render a mini atom ----------
    function renderMiniAtom(
      selector,
      shells,
      highlightOuter = false,
      missingSlot = false
    ) {
      const container = document.querySelector(selector);
      if (!container) return;
      container.innerHTML = "";
      shells.forEach((count, idx) => {
        const ring = document.createElement("div");
        ring.className = "orbit-ring";
        const radius = 28 + idx * 22;
        ring.style.width = radius * 2 + "px";
        ring.style.height = radius * 2 + "px";
        ring.style.position = "absolute";
        ring.style.top = "50%";
        ring.style.left = "50%";
        ring.style.transform = "translate(-50%, -50%)";
        ring.style.border = "1px solid rgba(255,255,255,0.3)";
        ring.style.borderRadius = "50%";
        for (let i = 0; i < count; i++) {
          const angle = (i / count) * Math.PI * 2;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          const dot = document.createElement("div");
          dot.className = "electron-dot";
          dot.style.position = "absolute";
          dot.style.left = "50%";
          dot.style.top = "50%";
          dot.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
          if (highlightOuter && idx === shells.length - 1) {
            dot.classList.add("gold");
          }
          ring.appendChild(dot);
        }
        if (missingSlot && idx === shells.length - 1) {
          const maxElectrons = 8;
          for (let j = count; j < maxElectrons; j++) {
            const angle = ((j + 0.5) / maxElectrons) * Math.PI * 2;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            const slot = document.createElement("div");
            slot.className = "electron-dot empty-slot";
            slot.style.position = "absolute";
            slot.style.left = "50%";
            slot.style.top = "50%";
            slot.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
            slot.style.width = "12px";
            slot.style.height = "12px";
            ring.appendChild(slot);
          }
        }
        container.appendChild(ring);
      });
    }

    // ---------- Station definitions ----------
    const stations = [
      // 0: Sodium loses 1 electron
      {
        conceptText:
          "Let's start with sodium. Tap the gold electron to remove it.",
        render: () => {
          card.innerHTML = `
        <div class="mini-atom" id="station1MiniAtom">
          <div class="atom-core na-core"></div>
          <div class="electron-orbits" data-shells="2,8,1" data-highlight="outer"></div>
        </div>
        <p class="charge-readout">Charge: <span id="ionCharge">0</span></p>
        <p class="hint-text" id="ionHint">👆 Tap the gold electron to remove it.</p>
      `;
          renderMiniAtom("#station1MiniAtom .electron-orbits", [2, 8, 1], true);
          let removed = false;
          document
            .getElementById("station1MiniAtom")
            .addEventListener("click", (e) => {
              if (e.target.classList.contains("gold") && !removed) {
                e.target.style.display = "none";
                removed = true;
                document.getElementById("ionCharge").textContent = "+1";
                document.getElementById("ionHint").textContent =
                  "✔ Sodium lost 1 electron → Na⁺";
                document.getElementById("ionHint").style.color = "var(--green)";
                audio.atomTap(); // 🎵 SOUND
                nextBtn.style.display = "inline-block";
              }
            });
        },
      },
      // 1: Chlorine gains 1 electron
      {
        conceptText: "Now chlorine. Tap the empty slot to add an electron.",
        render: () => {
          card.innerHTML = `
        <div class="mini-atom" id="station2MiniAtom">
          <div class="atom-core cl-core"></div>
          <div class="electron-orbits" data-shells="2,8,7" data-missing="outer"></div>
        </div>
        <p class="charge-readout">Charge: <span id="ionCharge">0</span></p>
        <p class="hint-text" id="ionHint">👆 Tap the empty slot to add an electron.</p>
      `;
          renderMiniAtom(
            "#station2MiniAtom .electron-orbits",
            [2, 8, 7],
            false,
            true
          );
          let added = false;
          document
            .getElementById("station2MiniAtom")
            .addEventListener("click", (e) => {
              if (e.target.classList.contains("empty-slot") && !added) {
                e.target.classList.remove("empty-slot");
                e.target.classList.add("electron-dot");
                e.target.style.background = "var(--teal)";
                e.target.style.boxShadow = "0 0 10px var(--teal)";
                added = true;
                document.getElementById("ionCharge").textContent = "-1";
                document.getElementById("ionHint").textContent =
                  "✔ Chlorine gained 1 electron → Cl⁻";
                document.getElementById("ionHint").style.color = "var(--green)";
                audio.atomTap(); // 🎵 SOUND
                nextBtn.style.display = "inline-block";
              }
            });
        },
      },
      // 2: Magnesium loses 2 electrons
      {
        conceptText: "What if an atom loses 2 electrons? Let's try magnesium.",
        render: () => {
          card.innerHTML = `
        <div class="mini-atom" id="station3MiniAtom">
          <div class="atom-core"></div>
          <div class="electron-orbits" data-shells="2,8,2" data-highlight="outer"></div>
        </div>
        <p class="charge-readout">Charge: <span id="ionCharge">0</span></p>
        <p class="hint-text" id="ionHint">👆 Tap both outer electrons to remove them.</p>
      `;
          renderMiniAtom("#station3MiniAtom .electron-orbits", [2, 8, 2], true);
          let removed = 0;
          document
            .getElementById("station3MiniAtom")
            .addEventListener("click", (e) => {
              if (
                e.target.classList.contains("gold") &&
                e.target.style.display !== "none"
              ) {
                e.target.style.display = "none";
                removed++;
                document.getElementById(
                  "ionCharge"
                ).textContent = `+${removed}`;
                audio.atomTap(); // 🎵 SOUND
                if (removed === 2) {
                  document.getElementById("ionHint").textContent =
                    "✔ Magnesium lost 2 electrons → Mg²⁺";
                  document.getElementById("ionHint").style.color =
                    "var(--green)";
                  nextBtn.style.display = "inline-block";
                }
              }
            });
        },
      },
      // 3: Oxygen gains 2 electrons
      {
        conceptText: "What if an atom gains 2 electrons? Let's try oxygen.",
        render: () => {
          card.innerHTML = `
        <div class="mini-atom" id="station4MiniAtom">
          <div class="atom-core"></div>
          <div class="electron-orbits" data-shells="2,6" data-missing="outer"></div>
        </div>
        <p class="charge-readout">Charge: <span id="ionCharge">0</span></p>
        <p class="hint-text" id="ionHint">👆 Tap the empty slots to add electrons.</p>
      `;
          renderMiniAtom(
            "#station4MiniAtom .electron-orbits",
            [2, 6],
            false,
            true
          );
          let added = 0;
          document
            .getElementById("station4MiniAtom")
            .addEventListener("click", (e) => {
              if (e.target.classList.contains("empty-slot") && added < 2) {
                e.target.classList.remove("empty-slot");
                e.target.classList.add("electron-dot");
                e.target.style.background = "var(--teal)";
                e.target.style.boxShadow = "0 0 10px var(--teal)";
                added++;
                document.getElementById("ionCharge").textContent = `-${added}`;
                audio.atomTap(); // 🎵 SOUND
                if (added === 2) {
                  document.getElementById("ionHint").textContent =
                    "✔ Oxygen gained 2 electrons → O²⁻";
                  document.getElementById("ionHint").style.color =
                    "var(--green)";
                  nextBtn.style.display = "inline-block";
                }
              }
            });
        },
      },
      // 4: Cation vs Anion sorting game
      {
        conceptText:
          "Let's sort these ions: are they cations (positive) or anions (negative)?",
        render: () => {
          card.innerHTML = `
        <div id="sortingGame" style="margin:1rem 0;">
          <div style="display:flex; flex-wrap:wrap; justify-content:center; gap:0.5rem; margin-bottom:1rem;" id="ionCards"></div>
          <div style="display:flex; justify-content:center; gap:2rem;">
            <div class="ion-bin" id="cationBin" style="border:2px dashed var(--teal); border-radius:12px; padding:0.5rem 1rem; min-width:120px;">
              <strong>Cations (+)</strong>
              <div id="cationList" style="margin-top:0.5rem;"></div>
            </div>
            <div class="ion-bin" id="anionBin" style="border:2px dashed var(--orange); border-radius:12px; padding:0.5rem 1rem; min-width:120px;">
              <strong>Anions (−)</strong>
              <div id="anionList" style="margin-top:0.5rem;"></div>
            </div>
          </div>
        </div>
        <p class="hint-text" id="sortingHint">👆 Tap an ion, then tap the correct bin.</p>
      `;
          const ions = [
            { symbol: "Na⁺", type: "cation" },
            { symbol: "Cl⁻", type: "anion" },
            { symbol: "Mg²⁺", type: "cation" },
            { symbol: "O²⁻", type: "anion" },
            { symbol: "Fe³⁺", type: "cation" },
            { symbol: "S²⁻", type: "anion" },
          ];
          let selectedIon = null;
          const hint = document.getElementById("sortingHint");
          const cationList = document.getElementById("cationList");
          const anionList = document.getElementById("anionList");
          let sortedCount = 0;

          function checkComplete() {
            sortedCount++;
            if (sortedCount === ions.length) {
              hint.textContent =
                "✔ All sorted! Cations lose electrons, anions gain electrons.";
              hint.style.color = "var(--green)";
              audio.sortCorrect(); // 🎵 SOUND – final sort success
              nextBtn.style.display = "inline-block";
            }
          }

          // Render ion cards
          const ionCardsDiv = document.getElementById("ionCards");
          ions.forEach((ion) => {
            const cardEl = document.createElement("div");
            cardEl.className = "ion-card";
            cardEl.textContent = ion.symbol;
            cardEl.style.padding = "0.5rem 1rem";
            cardEl.style.background = "rgba(255,255,255,0.08)";
            cardEl.style.border = "1px solid rgba(255,255,255,0.2)";
            cardEl.style.borderRadius = "8px";
            cardEl.style.cursor = "pointer";
            cardEl.style.transition = "0.2s";
            cardEl.addEventListener("click", () => {
              // Deselect previous
              document
                .querySelectorAll(".ion-card.selected")
                .forEach((c) => c.classList.remove("selected"));
              cardEl.classList.add("selected");
              selectedIon = ion;
              hint.textContent = `Selected ${ion.symbol}. Now tap the correct bin.`;
            });
            ionCardsDiv.appendChild(cardEl);
          });

          // Bin click handlers
          document.getElementById("cationBin").addEventListener("click", () => {
            if (!selectedIon) return;
            if (selectedIon.type === "cation") {
              const chip = document.createElement("span");
              chip.textContent = selectedIon.symbol + " ";
              chip.style.color = "var(--green)";
              cationList.appendChild(chip);
              document
                .querySelectorAll(".ion-card.selected")
                .forEach((c) => c.remove());
              selectedIon = null;
              hint.textContent = "Correct!";
              audio.sortCorrect(); // 🎵 SOUND
              checkComplete();
            } else {
              hint.textContent = `✗ ${selectedIon.symbol} is an anion (negative). Try the other bin.`;
              hint.style.color = "var(--red)";
              audio.sortWrong(); // 🎵 SOUND
            }
          });
          document.getElementById("anionBin").addEventListener("click", () => {
            if (!selectedIon) return;
            if (selectedIon.type === "anion") {
              const chip = document.createElement("span");
              chip.textContent = selectedIon.symbol + " ";
              chip.style.color = "var(--green)";
              anionList.appendChild(chip);
              document
                .querySelectorAll(".ion-card.selected")
                .forEach((c) => c.remove());
              selectedIon = null;
              hint.textContent = "Correct!";
              audio.sortCorrect(); // 🎵 SOUND
              checkComplete();
            } else {
              hint.textContent = `✗ ${selectedIon.symbol} is a cation (positive). Try the other bin.`;
              hint.style.color = "var(--red)";
              audio.sortWrong(); // 🎵 SOUND
            }
          });
        },
      },
      // 5: Fill-in-the-blank deep summary
      {
        conceptText: "Let's put it all together. Fill in the missing words.",
        render: () => {
          card.innerHTML = `
        <div id="fillBlanks" style="text-align:left; line-height:2; font-size:1rem;">
          <p>Everything is made of <span class="blank" data-answer="atoms" data-distractor="molecules">_________</span>.</p>
          <p>An atom has a nucleus with protons and neutrons, and <span class="blank" data-answer="electrons" data-distractor="photons">_________</span> that orbit around it.</p>
          <p>The first shell can hold up to <span class="blank" data-answer="2" data-distractor="8">_________</span> electrons.</p>
          <p>The second shell can hold up to <span class="blank" data-answer="8" data-distractor="2">_________</span> electrons.</p>
          <p>Atoms are most stable when their outer shell is <span class="blank" data-answer="full" data-distractor="half-empty">_________</span>.</p>
          <p>To become stable, sodium <span class="blank" data-answer="loses" data-distractor="gains">_________</span> one electron.</p>
          <p>When sodium loses an electron, it becomes a <span class="blank" data-answer="positive" data-distractor="negative">_________</span> ion.</p>
          <p>A positive ion is called a <span class="blank" data-answer="cation" data-distractor="anion">_________</span>.</p>
          <p>Chlorine <span class="blank" data-answer="gains" data-distractor="loses">_________</span> one electron to fill its outer shell.</p>
          <p>When chlorine gains an electron, it becomes a <span class="blank" data-answer="negative" data-distractor="positive">_________</span> ion.</p>
          <p>A negative ion is called an <span class="blank" data-answer="anion" data-distractor="cation">_________</span>.</p>
          <p>The attraction between a cation and an anion is an <span class="blank" data-answer="ionic" data-distractor="covalent">_________</span> bond.</p>
        </div>
        <p class="hint-text" id="fillHint" style="margin-top:1rem;">👆 Tap a blank, then choose the correct word.</p>
      `;
          const blanks = document.querySelectorAll(".blank");
          let correctCount = 0;
          const totalBlanks = blanks.length;
          const hint = document.getElementById("fillHint");

          blanks.forEach((blank) => {
            blank.style.display = "inline-block";
            blank.style.minWidth = "80px";
            blank.style.borderBottom = "2px dashed var(--teal)";
            blank.style.cursor = "pointer";
            blank.style.padding = "0 0.2rem";

            blank.addEventListener("click", function onBlankClick() {
              const answer = this.dataset.answer;
              const distractor = this.dataset.distractor;

              // Create a small popup
              const popup = document.createElement("span");
              popup.style.marginLeft = "0.5rem";
              popup.style.display = "inline-flex";
              popup.style.gap = "0.3rem";

              const correctBtn = document.createElement("button");
              correctBtn.textContent = answer;
              correctBtn.style.background = "var(--teal)";
              correctBtn.style.border = "none";
              correctBtn.style.borderRadius = "4px";
              correctBtn.style.color = "#000";
              correctBtn.style.padding = "0.2rem 0.5rem";
              correctBtn.style.cursor = "pointer";

              const wrongBtn = document.createElement("button");
              wrongBtn.textContent = distractor;
              wrongBtn.style.background = "var(--orange)";
              wrongBtn.style.border = "none";
              wrongBtn.style.borderRadius = "4px";
              wrongBtn.style.color = "#fff";
              wrongBtn.style.padding = "0.2rem 0.5rem";
              wrongBtn.style.cursor = "pointer";

              popup.appendChild(correctBtn);
              popup.appendChild(wrongBtn);
              this.parentNode.insertBefore(popup, this.nextSibling);

              // Disable further clicks on this blank
              this.style.pointerEvents = "none";

              correctBtn.addEventListener("click", () => {
                popup.remove();
                this.textContent = answer;
                this.style.borderBottom = "2px solid var(--green)";
                this.style.color = "var(--green)";
                audio.fillCorrect(); // 🎵 SOUND
                correctCount++;
                if (correctCount === totalBlanks) {
                  hint.innerHTML = "✔ Amazing! You've mastered ionic bonding!";
                  hint.style.color = "var(--green)";
                  audio.fillComplete(); // 🎵 SOUND
                  nextBtn.style.display = "inline-block";
                }
              });

              wrongBtn.addEventListener("click", () => {
                popup.remove();
                this.style.borderBottom = "2px dashed var(--red)";
                this.style.color = "var(--red)";
                // Re-enable the blank
                this.style.pointerEvents = "auto";
              });
            });
          });
        },
      },
      // 6: Ionic bond animation + finish
      {
        conceptText: "What holds Na⁺ and Cl⁻ together?",
        render: () => {
          card.innerHTML = `
  <div class="bond-animation">
    <span class="ion-box positive">Na⁺</span>
    <span class="ion-box negative">Cl⁻</span>
  </div>
  <p class="bond-explanation">Opposite charges attract. This attraction is the <strong>ionic bond</strong>.</p>
  <button id="completeModuleBtn" class="btn btn-primary" style="margin-top:1.5rem;">
    Complete Module →
  </button>
`;
          audio.bondPull(); // 🎵 SOUND – gentle rising hum
          // Immediately attach the finish action
          document
            .getElementById("completeModuleBtn")
            .addEventListener("click", () => {
              addXP(50);
              markModuleDone("chemistry");
              celebrate();
              goToStep(5);
            });
          // Hide the generic next button – we're using our own
          nextBtn.style.display = "none";
        },
      },
    ];

    let currentStation = 0;

    function showStation(index) {
      if (index >= stations.length) {
        // Module finished
        addXP(50);
        markModuleDone("chemistry");
        celebrate();
        goToStep(5);
        return;
      }
      const station = stations[index];
      concept.innerHTML = `<p>${station.conceptText}</p>`;
      station.render();
      nextBtn.style.display = "none";
      if (index === stations.length - 1) {
        nextBtn.textContent = "Complete Module →";
      } else {
        nextBtn.textContent = "Next →";
      }
    }

    nextBtn.addEventListener("click", () => {
      currentStation++;
      showStation(currentStation);
      card.scrollIntoView({ behavior: "smooth", block: "center" });
    });

    showStation(0);
  }

  // Map step IDs to their setup functions
  const stepSetups = {
    "c-step0-1": setupStep0_1,
    "c-step0-2": setupStep0_2,
    "c-step0-3": setupStep0_3,
    "c-step0-4": setupStep0_4,
    "c-step0-5": setupStep0_5,
    "c-step0-6": setupStep0_6,
    "c-step0-7": setupStep0_7,
    "c-step0-8": setupStep0_8,
  };

  // Restore the saved sub-step, or start fresh
  const savedStep = CONFIG.chemistryStep || "c-step0-1";
  if (stepSetups[savedStep]) {
    showStep(savedStep);
    stepSetups[savedStep](); // set up that step
  } else {
    // fallback
    setupStep0_1();
    showStep("c-step0-1");
  }
}

// js/survey.js

// Load existing analytics or start fresh
let analytics = JSON.parse(localStorage.getItem("learningArcadeAnalytics")) || {
  rating: 0,
  textbookBetter: null,
  chosenPlan: null,
  chosenSubjects: [],
  enteredEmail: false,
  usageFrequency: null,
  totalXP: 0,
  modulesCompleted: 0,
  timeStarted: Date.now(),
};

function saveAnalytics() {
  localStorage.setItem("learningArcadeAnalytics", JSON.stringify(analytics));
}

// Screen navigation – now includes screen 0
let currentScreen = 0;
const totalScreens = 7; // screens 0..6
const screenHistory = [];

function showScreen(n) {
  // Hide all screens (0..6)
  for (let i = 0; i < totalScreens; i++) {
    const screen = document.getElementById("scr" + i);
    if (screen) screen.style.display = "none";
  }
  // Show requested screen
  const target = document.getElementById("scr" + n);
  if (target) target.style.display = "block";

  // History management
  if (
    screenHistory.length === 0 ||
    screenHistory[screenHistory.length - 1] !== n
  ) {
    screenHistory.push(n);
  }

  // Back button visibility
  const backBtn = document.getElementById("surveyBackBtn");
  if (backBtn) {
    backBtn.style.visibility = n === 0 ? "hidden" : "visible";
  }

  // Progress text – show Step X of 6 (since screen 0 is just greeting)
  const progress = document.getElementById("surveyProgress");
  if (progress) {
    if (n === 0) {
      progress.textContent = ""; // nothing for greeting
    } else {
      progress.textContent = `Step ${n} of 6`;
    }
  }

  currentScreen = n;
  // Scroll into view
  if (target) {
    target.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}

function goBack() {
  if (screenHistory.length > 1) {
    screenHistory.pop();
    const previous = screenHistory[screenHistory.length - 1];
    showScreen(previous);
  }
}

function initSurvey() {
  // Attach back button listener
  document.getElementById("surveyBackBtn").addEventListener("click", goBack);

  // ===== Screen 0: Friendly introduction =====
  (function setupScreen0() {
    document.getElementById("nextScr0").addEventListener("click", () => {
      showScreen(1);
    });
  })();

  // ===== Screen 1: Star Rating =====
  (function setupScreen1() {
    const starRating = document.getElementById("starRating");
    const scr1Fb = document.getElementById("scr1Fb");
    const nextScr1 = document.getElementById("nextScr1");
    let rating = 0;

    for (let i = 1; i <= 5; i++) {
      const star = document.createElement("span");
      star.textContent = "★";
      star.className = "star";
      star.addEventListener("click", () => {
        rating = i;
        document.querySelectorAll("#starRating .star").forEach((s, idx) => {
          s.classList.toggle("active", idx < i);
        });
        scr1Fb.innerHTML = "✔ Thanks! That really helps. ✨";
        scr1Fb.style.color = "var(--green)";
        nextScr1.disabled = false;
        analytics.rating = rating;
        saveAnalytics();
        haptics.correct();
        haptics.applyAnimation(scr1Fb, "correct");
      });
      starRating.appendChild(star);
    }

    nextScr1.addEventListener("click", () => {
      showScreen(2);
    });
  })();

  // ===== Screen 2: Textbook Comparison =====
  (function setupScreen2() {
    const textbookOpts = document.getElementById("textbookOpts");
    const scr2Fb = document.getElementById("scr2Fb");
    const nextScr2 = document.getElementById("nextScr2");
    const choices = [
      { text: "Yes, much better", value: "better" },
      { text: "About the same", value: "same" },
      { text: "No, I prefer textbooks", value: "worse" },
    ];

    textbookOpts.innerHTML = "";
    let textbookAnswer = null;

    choices.forEach((choice) => {
      const btn = document.createElement("div");
      btn.className = "option";
      btn.textContent = choice.text;
      btn.addEventListener("click", () => {
        document
          .querySelectorAll("#textbookOpts .option")
          .forEach((o) => o.classList.remove("selected"));
        btn.classList.add("selected");
        textbookAnswer = choice.value;
        scr2Fb.innerHTML = "✔ Got it! Thanks for being honest.";
        scr2Fb.style.color = "var(--green)";
        nextScr2.disabled = false;
        analytics.textbookBetter = textbookAnswer;
        saveAnalytics();
        haptics.correct();
        haptics.applyAnimation(scr2Fb, "correct");
      });
      textbookOpts.appendChild(btn);
    });

    nextScr2.addEventListener("click", () => {
      showScreen(3);
    });
  })();

  // ===== Screen 3: Choose Plan (hypothetical) =====
  (function setupScreen3() {
    const plans = document.querySelectorAll(".plan");
    const reserveBtn = document.getElementById("reserveBtn");
    let selectedPlan = null;

    // Friendly hint
    const hint = document.createElement("p");
    hint.style.fontSize = "0.85rem";
    hint.style.color = "var(--gray-light)";
    hint.textContent =
      "Just pick whatever looks like the best value – it's for my research!";
    document
      .getElementById("planCards")
      .parentNode.insertBefore(hint, document.getElementById("planCards"));

    plans.forEach((plan) => {
      plan.addEventListener("click", () => {
        plans.forEach((p) => p.classList.remove("selected"));
        plan.classList.add("selected");
        selectedPlan = plan.dataset.plan;
        reserveBtn.disabled = false;
        // No manual checkmark – CSS ::after handles it
      });
    });

    reserveBtn.addEventListener("click", () => {
      analytics.chosenPlan = selectedPlan;
      saveAnalytics();
      if (selectedPlan === "premium") {
        analytics.chosenSubjects = ["All subjects"];
        saveAnalytics();
        showScreen(5); // skip subject picker
      } else {
        showScreen(4);
        setupSubjectPicker(selectedPlan);
      }
    });
  })();

  // ===== Screen 4: Subject Picker =====
  function setupSubjectPicker(plan) {
    const subjHead = document.getElementById("subjHead");
    const grid = document.getElementById("subjectGrid");
    const subjFb = document.getElementById("subjFb");
    const nextSubj = document.getElementById("nextSubj");
    const max = plan === "basic" ? 1 : 3;
    subjHead.textContent = `Pick ${max} subject(s) you’d like`;
    grid.innerHTML = "";

    const subjects = [
      "Physics",
      "Chemistry",
      "Biology",
      "Maths",
      "English",
      "Kiswahili",
      "History",
      "Geography",
      "Computer",
      "P.E",
      "CSL",
      "CRE",
    ];
    let selected = [];

    subjects.forEach((sub) => {
      const chip = document.createElement("div");
      chip.className = "option";
      chip.textContent = sub;
      chip.addEventListener("click", () => {
        if (selected.includes(sub)) {
          selected = selected.filter((s) => s !== sub);
          chip.classList.remove("selected");
        } else if (selected.length < max) {
          selected.push(sub);
          chip.classList.add("selected");
        } else {
          // Replace first
          const removed = selected.shift();
          document.querySelectorAll("#subjectGrid .option").forEach((c) => {
            if (c.textContent === removed) c.classList.remove("selected");
          });
          selected.push(sub);
          chip.classList.add("selected");
        }
        if (selected.length === max) {
          subjFb.innerHTML = "✔ Nice picks!";
          subjFb.style.color = "var(--green)";
          nextSubj.disabled = false;
          haptics.correct();
          haptics.applyAnimation(subjFb, "correct");
        } else {
          nextSubj.disabled = true;
          subjFb.innerHTML = `Choose ${max - selected.length} more`;
          subjFb.style.color = "var(--teal)";
        }
      });
      grid.appendChild(chip);
    });

    nextSubj.addEventListener("click", () => {
      analytics.chosenSubjects = selected;
      saveAnalytics();
      showScreen(5);
    });
  }

  // ===== Screen 5: Email (optional) =====
  (function setupScreen5() {
    const emailInput = document.getElementById("emailInput");
    const confirmBtn = document.getElementById("confirmBtn");

    confirmBtn.addEventListener("click", () => {
      analytics.enteredEmail = emailInput.value.trim() !== "";
      saveAnalytics();
      showScreen(6);
      populateConfirmation();
    });

    // Add a skip option
    const skipBtn = document.createElement("button");
    skipBtn.className = "btn btn-back";
    skipBtn.textContent = "Skip for now";
    skipBtn.style.marginLeft = "0.5rem";
    skipBtn.addEventListener("click", () => {
      analytics.enteredEmail = false;
      saveAnalytics();
      showScreen(6);
      populateConfirmation();
    });
    confirmBtn.parentNode.appendChild(skipBtn);
  })();

  // ===== Screen 6: Confirmation + Frequency =====
  function populateConfirmation() {
    const plan = analytics.chosenPlan || "pro";
    const prices = {
      basic: "KES 150/month",
      pro: "KES 300/month",
      premium: "KES 500/month",
    };
    const planNames = { basic: "Basic", pro: "Pro", premium: "Premium" };
    const planName = planNames[plan] || "Pro";
    const planPrice = prices[plan] || "KES 300/month";

    const confirmBox = document.getElementById("confirmBox");
    confirmBox.innerHTML = `
      <p style="font-size:1.2rem;">🎉 You're awesome!</p>
      <p>You picked <strong>${planName}</strong> (${planPrice}).<br>
      <span style="color:var(--teal);">Your feedback means a lot to me.</span></p>
    `;

    // Frequency options
    const freqOpts = document.getElementById("freqOpts");
    freqOpts.innerHTML = "";
    const frequencies = [
      "Daily",
      "3-5 times/week",
      "Weekly",
      "Monthly",
      "Never",
    ];
    const finishBtn = document.getElementById("finishBtn");

    frequencies.forEach((freq) => {
      const btn = document.createElement("div");
      btn.className = "option";
      btn.textContent = freq;
      btn.addEventListener("click", () => {
        document
          .querySelectorAll("#freqOpts .option")
          .forEach((o) => o.classList.remove("selected"));
        btn.classList.add("selected");
        analytics.usageFrequency = freq;
        saveAnalytics();
        finishBtn.disabled = false;
        haptics.correct();
      });
      freqOpts.appendChild(btn);
    });

    finishBtn.addEventListener("click", () => {
      analytics.totalXP = CONFIG.xp;
      analytics.modulesCompleted = Object.values(CONFIG.modules).filter(
        Boolean
      ).length;
      analytics.timeSpent = Math.floor(
        (Date.now() - analytics.timeStarted) / 1000
      );
      saveAnalytics();
      sendToServer();

      addXP(150);
      goToStep(6);

      setTimeout(() => {
        const thankPlan = document.getElementById("thankPlan");
        if (thankPlan) {
          thankPlan.textContent = `Thanks for picking ${planName}! Your contribution helps my project.`;
        }
      }, 50);
    });
  }

  // Start on screen 0
  showScreen(0);
}

function sendToServer() {
  if (
    window.location.hostname === "127.0.0.1" ||
    window.location.hostname === "localhost"
  ) {
    console.log("📋 Running locally – analytics not sent to server.");
    return;
  }

  fetch("/api/analytics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(analytics),
  })
    .then((res) => res.json())
    .then((data) => console.log("Analytics sent to server:", data))
    .catch((err) => console.error("Failed to send analytics:", err));
}

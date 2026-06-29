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

// Screen navigation
let currentScreen = 1;
const totalScreens = 6;
const screenHistory = [];

function showScreen(n) {
  // Hide all screens
  for (let i = 1; i <= totalScreens; i++) {
    const screen = document.getElementById("scr" + i);
    if (screen) screen.style.display = "none";
  }
  // Show requested screen
  const target = document.getElementById("scr" + n);
  if (target) target.style.display = "block";

  // Push current screen to history if not already the last
  if (
    screenHistory.length === 0 ||
    screenHistory[screenHistory.length - 1] !== n
  ) {
    screenHistory.push(n);
  }

  // Update back button visibility
  const backBtn = document.getElementById("surveyBackBtn");
  if (backBtn) {
    backBtn.style.visibility = n === 1 ? "hidden" : "visible";
  }

  // Update progress text
  const progress = document.getElementById("surveyProgress");
  if (progress) {
    progress.textContent = `Step ${n} of ${totalScreens}`;
  }

  currentScreen = n;
}

function goBack() {
  if (screenHistory.length > 1) {
    screenHistory.pop(); // remove current
    const previous = screenHistory[screenHistory.length - 1];
    showScreen(previous);
  }
}

function initSurvey() {
  // Attach back button listener
  document.getElementById("surveyBackBtn").addEventListener("click", goBack);

  // Screen 1: Star Rating
  const scr1 = document.getElementById("scr1");
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
      scr1Fb.innerHTML = "✔ You rated " + i + " stars";
      scr1Fb.style.color = "var(--green)";
      nextScr1.disabled = false;
      analytics.rating = rating;
      saveAnalytics();
    });
    starRating.appendChild(star);
  }

  nextScr1.addEventListener("click", () => {
    showScreen(2);
  });

  // Screen 2: Textbook Comparison
  const textbookOpts = document.getElementById("textbookOpts");
  const scr2Fb = document.getElementById("scr2Fb");
  const nextScr2 = document.getElementById("nextScr2");
  const choices = [
    { text: "Yes, much better", value: "better" },
    { text: "About the same", value: "same" },
    { text: "No, I prefer textbooks", value: "worse" },
  ];
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
      scr2Fb.innerHTML = "✔ Answer recorded";
      scr2Fb.style.color = "var(--green)";
      nextScr2.disabled = false;
      analytics.textbookBetter = textbookAnswer;
      saveAnalytics();
    });
    textbookOpts.appendChild(btn);
  });

  nextScr2.addEventListener("click", () => {
    showScreen(3);
  });

  // Screen 3: Choose Plan
  const plans = document.querySelectorAll(".plan");
  const reserveBtn = document.getElementById("reserveBtn");
  let selectedPlan = null;

  plans.forEach((plan) => {
    plan.addEventListener("click", () => {
      plans.forEach((p) => p.classList.remove("selected"));
      plan.classList.add("selected");
      selectedPlan = plan.dataset.plan;
      reserveBtn.disabled = false;
    });
  });

  reserveBtn.addEventListener("click", () => {
    analytics.chosenPlan = selectedPlan;
    saveAnalytics();
    if (selectedPlan === "premium") {
      analytics.chosenSubjects = ["All subjects"];
      saveAnalytics();
      showScreen(5);
    } else {
      showScreen(4);
      setupSubjectPicker(selectedPlan);
    }
  });

  // Screen 4: Subject Picker
  function setupSubjectPicker(plan) {
    const subjHead = document.getElementById("subjHead");
    const grid = document.getElementById("subjectGrid");
    const subjFb = document.getElementById("subjFb");
    const nextSubj = document.getElementById("nextSubj");
    const max = plan === "basic" ? 1 : 3;
    subjHead.textContent = `Pick ${max} subject(s)`;
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
          // Replace first selection
          const removed = selected.shift();
          document.querySelectorAll("#subjectGrid .option").forEach((c) => {
            if (c.textContent === removed) c.classList.remove("selected");
          });
          selected.push(sub);
          chip.classList.add("selected");
        }
        if (selected.length === max) {
          subjFb.innerHTML = "✔ " + max + " subject(s) selected";
          subjFb.style.color = "var(--green)";
          nextSubj.disabled = false;
        } else {
          nextSubj.disabled = true;
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

  // Screen 5: Checkout (Email)
  const emailInput = document.getElementById("emailInput");
  const confirmBtn = document.getElementById("confirmBtn");

  confirmBtn.addEventListener("click", () => {
    if (emailInput.value.trim() !== "") {
      analytics.enteredEmail = true;
      saveAnalytics();
      showScreen(6);
      populateConfirmation();
    } else {
      emailInput.style.borderColor = "var(--red)";
      setTimeout(() => (emailInput.style.borderColor = ""), 500);
    }
  });

  // Screen 6: Confirmation + Frequency
  function populateConfirmation() {
    const plan = analytics.chosenPlan;
    const prices = {
      basic: "KES 150/month",
      pro: "KES 300/month",
      premium: "KES 500/month",
    };
    const planNames = { basic: "Basic", pro: "Pro", premium: "Premium" };
    document.getElementById("confirmPlanName").textContent = planNames[plan];
    document.getElementById("confirmPlanPrice").textContent = prices[plan];

    const freqOpts = document.getElementById("freqOpts");
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
      });
      freqOpts.appendChild(btn);
    });

    finishBtn.addEventListener("click", () => {
      // Finalize analytics
      analytics.totalXP = CONFIG.xp;
      analytics.modulesCompleted = Object.values(CONFIG.modules).filter(
        Boolean
      ).length;
      analytics.timeSpent = Math.floor(
        (Date.now() - analytics.timeStarted) / 1000
      );
      saveAnalytics();

      sendToServer();

      // Move to the thank‑you page first, then set the subscription text
      addXP(150);
      goToStep(6);

      // After the step transition completes, insert the plan info
      setTimeout(() => {
        const plan = analytics.chosenPlan;
        const prices = {
          basic: "KES 150/month",
          pro: "KES 300/month",
          premium: "KES 500/month",
        };
        const planNames = { basic: "Basic", pro: "Pro", premium: "Premium" };
        const thankPlan = document.getElementById("thankPlan");
        console.log("thankPlan element:", thankPlan);
        if (thankPlan && plan) {
          thankPlan.textContent = `You've reserved the ${planNames[plan]} plan at ${prices[plan]}. We'll notify you when we launch.`;
          console.log("thankPlan text set to:", thankPlan.textContent);
        } else {
          console.warn("thankPlan or plan missing", { thankPlan, plan });
        }
      }, 50);
    });
  }

  // Show first screen
  showScreen(1);
}

function sendToServer() {
  fetch("/api/analytics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(analytics),
  })
    .then((res) => res.json())
    .then((data) => console.log("Analytics sent to server:", data))
    .catch((err) => console.error("Failed to send analytics:", err));
}

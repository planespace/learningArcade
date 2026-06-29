require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Analytics schema & routes (unchanged)
const analyticsSchema = new mongoose.Schema({
  rating: Number,
  textbookBetter: String,
  chosenPlan: String,
  chosenSubjects: [String],
  enteredEmail: Boolean,
  usageFrequency: String,
  totalXP: Number,
  modulesCompleted: Number,
  timeSpent: Number,
  timestamp: { type: Date, default: Date.now },
});
const Analytics = mongoose.model("Analytics", analyticsSchema);

app.post("/api/analytics", async (req, res) => {
  try {
    const entry = new Analytics(req.body);
    await entry.save();
    res.status(201).json({ message: "Analytics saved" });
  } catch (error) {
    res.status(500).json({ error: "Failed to save analytics" });
  }
});

app.get("/api/analytics", async (req, res) => {
  try {
    const data = await Analytics.find().sort({ timestamp: -1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch analytics" });
  }
});

// ---- DEBUG ROUTE ----
app.get("/debug", (req, res) => {
  const root = __dirname;
  const files = fs.readdirSync(root);
  const jsFolderExists = fs.existsSync(path.join(root, "js"));
  let jsFiles = [];
  if (jsFolderExists) {
    jsFiles = fs.readdirSync(path.join(root, "js"));
  }
  res.json({
    root: root,
    files: files,
    jsFolderExists: jsFolderExists,
    jsFiles: jsFiles,
  });
});

// Serve static files from the actual project root
app.use(
  express.static(__dirname, {
    setHeaders: (res, filePath) => {
      if (filePath.endsWith(".js")) {
        res.setHeader("Content-Type", "application/javascript");
      } else if (filePath.endsWith(".css")) {
        res.setHeader("Content-Type", "text/css");
      }
    },
  })
);

// Fallback for unmatched routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

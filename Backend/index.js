const mongoose = require("mongoose");
require("dotenv").config();
const express = require("express");

const { customAlphabet } = require("nanoid");
const geoip = require("geoip-lite");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const cors = require("cors");
app.use(cors(
  origin="*"
));

const logStream = fs.createWriteStream(path.join(__dirname, "logs.txt"), { flags: "a" });
app.use((req, res, next) => {
  const log = `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} from ${req.ip}\n`;
  logStream.write(log);
  next();
});


mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB connected")).catch(err => console.error("MongoDB error", err));


const clickSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  referrer: String,
  location: String,
});

const urlSchema = new mongoose.Schema({
  originalUrl: String,
  shortCode: { type: String, unique: true },
  createdAt: { type: Date, default: Date.now },
  expiry: Date,
  clicks: [clickSchema],
});

const Url = mongoose.model("Url", urlSchema);


app.post("/shorturls", async (req, res) => {
  try {
    const { url, validity = 30, shortcode } = req.body;

    if (!url) return res.status(400).json({ error: "URL is required" });

    let code = shortcode || customAlphabet("1234567890abcdefghijklmnopqrstuvwxyz", 6)();

    const existing = await Url.findOne({ shortCode: code });
    if (existing) return res.status(409).json({ error: "Shortcode already exists" });

    const expiry = new Date(Date.now() + validity * 60000); 

    const newUrl = await Url.create({
      originalUrl: url,
      shortCode: code,
      expiry,
    });

    res.status(201).json({
      shortLink: `http://localhost:${process.env.PORT || 5000}/${code}`,
      expiry: expiry.toISOString(),
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});


app.get("/:code", async (req, res) => {
  try {
    const { code } = req.params;
    const url = await Url.findOne({ shortCode: code });

    if (!url) return res.status(404).json({ error: "Shortcode not found" });

    if (url.expiry < new Date())
      return res.status(410).json({ error: "Shortcode expired" });

    url.clicks.push({
      referrer: req.get("Referrer") || "Direct",
      location: geoip.lookup(req.ip)?.country || "Unknown",
    });

    await url.save();
    res.redirect(url.originalUrl);
  } catch (err) {
    res.status(500).json({ error: "Redirection error" });
  }
});


app.get("/shorturls/:code", async (req, res) => {
  try {
    const { code } = req.params;
    const url = await Url.findOne({ shortCode: code });

    if (!url) return res.status(404).json({ error: "Shortcode not found" });

    res.json({
      originalUrl: url.originalUrl,
      createdAt: url.createdAt,
      expiry: url.expiry,
      totalClicks: url.clicks.length,
      clicks: url.clicks,
    });
  } catch (err) {
    res.status(500).json({ error: "Error fetching stats" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

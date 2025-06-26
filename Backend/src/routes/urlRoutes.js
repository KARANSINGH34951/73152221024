const express = require("express");
const router = express.Router();
const {
  createShortUrl,
  redirectUrl,
  getStats
} = require("../controllers/urlController");

router.post("/shorturls", createShortUrl);
router.get("/:code", redirectUrl);
router.get("/shorturls/:code", getStats);

module.exports = router;

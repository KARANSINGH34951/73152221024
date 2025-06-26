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
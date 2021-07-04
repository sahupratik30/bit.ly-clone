const express = require("express");
const mongoose = require("mongoose");
mongoose
  .connect("mongodb://localhost:27017/urlShortener", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connection Successful...");
  })
  .catch((e) => {
    console.log("Connection failed");
  });
const app = express();
const ShortUrl = require("./models/shortUrl");
app.use(express.urlencoded({ extended: false }));
const PORT = process.env.port || 5000;
app.set("view engine", "ejs");
app.get("/", async (req, res) => {
  const shortUrls = await ShortUrl.find();
  res.render("index", { shortUrls: shortUrls });
});
app.post("/shortUrl", async (req, res) => {
  await ShortUrl.create({ full: req.body.url });
  res.redirect("/");
});
app.get("/:shortUrl", async (req, res) => {
  const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl });
  if (shortUrl == null) return res.sendStatus(404);
  shortUrl.clicks++;
  shortUrl.save();
  res.redirect(shortUrl.full);
});

app.listen(PORT, () => {
  console.log(`Listening to port ${PORT}`);
});

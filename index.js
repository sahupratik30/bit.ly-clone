const express = require("express");
const createHttpError = require("http-errors");
const shortid = require("shortid");
const ShortUrl = require("./models/shortUrl");
const mongoose = require("mongoose");
mongoose
  .connect("mongodb://localhost:27017/urlShortener", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("Connection Successful...");
  })
  .catch((e) => {
    console.log("Connection failed");
  });
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const PORT = process.env.port || 5000;
app.set("view engine", "ejs");
app.get("/", async (req, res) => {
  res.render("index");
});
app.post("/", async (req, res, next) => {
  const url = req.body.url;
  try {
    if (!url) {
      throw createHttpError.BadRequest("Enter a valid url");
    }
    const urlExists = await ShortUrl.findOne({ full: url });
    if (urlExists) {
      res.render("index", {
        header: `${req.hostname}`,
        short_url: `${urlExists.short}`,
      });
      return;
    }
    const shortUrl = new ShortUrl({ full: url, short: shortid.generate() });
    const result = await shortUrl.save();
    res.render("index", {
      header: `${req.hostname}`,
      short_url: `${result.short}`,
    });
  } catch (error) {
    next(error);
  }
});
app.get("/:shortId", async (req, res, next) => {
  try {
    const shortId = req.params.shortId;
    const result = await ShortUrl.findOne({ short: shortId });
    if (!result) {
      throw createHttpError.NotFound("URL does not exist");
    }
    res.redirect(result.full);
  } catch (error) {
    next(error);
  }
});
app.use((req, res, next) => {
  next(createHttpError.NotFound());
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.render("index", { error: err.message });
});

app.listen(PORT, () => {
  console.log(`Listening to port ${PORT}`);
});

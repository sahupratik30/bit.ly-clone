const mongoose = require("mongoose");
const shortid = require("shortid");

const ShortUrlSchema = new mongoose.Schema({
  full: {
    type: String,
    required: true,
  },
  short: {
    type: String,
    required: true,
  },
});

const shortUrl = mongoose.model("ShortUrl", ShortUrlSchema);

module.exports = shortUrl;

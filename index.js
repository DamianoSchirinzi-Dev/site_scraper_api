const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const app = express();

const data = [];

app.get("/api", (req, res) => {
  axios
    .get(req.query.url)
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);

      $("a", html).each(function () {
        const header = $(this).text().trim();
        const url = $(this).attr("href");
        data.push({
          header,
          url,
        });
      });

      $("");
      res.json(data);
    })
    .catch((err) => console.log(err));
});

app.listen(8000, console.log("listening on http://localhost:8000"));

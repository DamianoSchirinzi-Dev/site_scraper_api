const Joi = require("joi");
const axios = require("axios");
const cheerio = require("cheerio");
const express = require("express");
const app = express();

app.use(express.json());

//The Gaurdian
app.get("/api/scrape/gaurdian", async (req, res) => {
  axios
    .get(req.query.url)
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);

      const scrapedData = {
        "article-title": $(
          "[data-gu-name|='headline'] > div > div > h1"
        ).text(),

        "article-sub-heading": $(
          "[data-gu-name|='standfirst'] > div > p"
        ).text(),
      };

      $("#maincontent > div", html).each(function () {
        const content = $(this).text().replaceAll(".", ". ");

        scrapedData["article-summary"] = content;
      });

      res.send(scrapedData);
    })
    .catch((err) => {
      console.log(err);
    });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Live on http://localhost:${port}...`));

function replaceAll(str, find, replace) {
  return str.replace(new RegExp(find, "g"), replace);
}

// npm i request request-promise json2csv cheerio

const request = require("request-promise");
const cheerio = require("cheerio");
const fs = require("fs");
const json2csv = require("json2csv").Parser;

const movies = [
  "https://www.imdb.com/title/tt5180504/",
  "https://www.imdb.com/title/tt4052886/?ref_=tt_sims_tti",
];

(async () => {
  let IMDBData = [];
  for (let movie of movies) {
    const response = await request({
      uri: movie,
      headers: {
        accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "accept-encoding": "gzip, deflate, br",
        "accept-language": "en-GB,en;q=0.9,en-US;q=0.8",
      },
      gzip: true,
    });

    let $ = cheerio.load(response);
    let title = $('div[class="title_wrapper"] > h1').text().trim();
    let rating = $('div[class="ratingValue"] > strong > span').text();
    let summary = $('div[class="summary_text"]').text().trim();
    let releaseDate = $('a[title="See more release dates"]').text().trim();
    let starCast = $('div.credit_summary_item:nth-child(3) > a:nth-child(-n+3)').text()
    IMDBData.push({
      title,
      rating,
      summary,
      releaseDate,
      starCast
    });
  }
  const j2cp = new json2csv();
  const csv = j2cp.parse(IMDBData);

  fs.writeFileSync("./imdb.csv", csv, "utf-8");
})();

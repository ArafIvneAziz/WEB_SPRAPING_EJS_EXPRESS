const express = require("express");
const cheerio = require("cheerio");
const axios = require("axios");
const app = express();

// Setting view engine to ejs
app.set("view engine", "ejs");

// Declaring scrapedDataJSON variable outside of performScraping() function
let scrapedDataJSON = {};

// Defining performScraping() function
async function performScraping() {
  // Downloading the target web page
  // by performing an HTTP GET request in Axios
  const axiosResponse = await axios.request({
    method: "GET",
    url: "https://brightdata.com/",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36"
    }
  });

  // Parsing the HTML source of the target web page with Cheerio
  const $ = cheerio.load(axiosResponse.data);

  // Initializing the data structures
  // that will contain the scraped data
  const marketLeaderReasons = [];

  // Scraping the "What makes Bright Data
  // the undisputed industry leader" section
  $(".e-con-inner")
  .find(".elementor-element-7942181b")
    .each((index, element) => {
      // Extracting the data of interest
      const image = $(element)
        .find(".elementor-image-box-img").find("a").find("img")
        .attr("href");
      const title = $(element)
        .find("elementor-image-box-title").find("a")
        .text();

      // Converting the data extracted into a more
      // readable object
      const marketLeaderReason = {
        title: title,
        image: image
      };

      // Adding the object containing the scraped data
      // to the marketLeaderReasons array
      marketLeaderReasons.push(marketLeaderReason);
    });

  // Trasforming the scraped data into a general object
  const scrapedData = {
    marketLeader: marketLeaderReasons
  };

  // Converting the scraped data object to JSON
  scrapedDataJSON = JSON.stringify(scrapedData);
  // Storing scrapedDataJSON in a database via an API call...
}

// Route for index page
app.get("/", function(req, res) {
  var subheading = scrapedDataJSON;
  var subhead = JSON.parse(subheading)
  res.render("index", {
    subheading: subheading ,
    subhead: subhead
  });
});

// Calling performScraping() before the app.get() function
performScraping();

// Setting up the server
app.listen(8080, function() {
  console.log("Server is running on port 8080");
});
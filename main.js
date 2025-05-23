const { crawlPage } = require("./crawl");
const { printReport } = require("./report");
async function main() {
  if (process.argv.length < 3) {
    console.log("provide a website URL");
    process.exit(1);
  }
  if (process.argv.length > 3) {
    console.log("too many arguments");
    process.exit(1);
  }
  const baseURL = process.argv[2];
  
  console.log("starting crawl of", baseURL);
  const pages = await crawlPage(baseURL, baseURL, {});

  printReport(pages);
}
main();

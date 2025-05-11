function printReport(pages) {
  console.log("Crawl Report");
  console.log("====================================");
  const sortedPages = sortPages(pages);
  for (const page of sortedPages) {
    const url = page[0];
    const hits = page[1];
    console.log(`found ${hits} links to ${url}`);
  }
  console.log('END');
}

function sortPages(pages) {
  const pagesArray = Object.entries(pages);
  pagesArray.sort((a, b) => {
    aHits = a[1];
    bHits = b[1];
    return bHits - aHits; 
  })
  return pagesArray;
}
module.exports = { sortPages, printReport };
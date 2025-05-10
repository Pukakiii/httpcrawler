const { JSDOM } = require('jsdom');

async function crawlPage(currentUrl) {
  console.log(`Crawling ${currentUrl}`);
  try {
  const resp = await fetch(currentUrl);
  
  if (resp.status > 399) {
    console.error(`Error fetching ${currentUrl}: ${resp.status}`);
    return;
  }
 
  const contentType = resp.headers.get('content-type');
  if (!contentType.includes('text/html')) {
    console.log(`Error fetching ${currentUrl}: ${resp.status}, not HTML`);
    return;
  }

  console.log(`Response text: ${await resp.text()}`);
  } catch (error) {
    console.error(`Error fetching ${currentUrl}: ${error.message}, status: ${error.status}`);
  }
};

function getUrlFromHTML(htmlBody, baseUrl) {

  const Urls = [];
  const dom = new JSDOM(htmlBody);
  const linkElements = dom.window.document.querySelectorAll('a')
  for (const linkElement of linkElements) {
    if (linkElement.href.slice(0, 1) === '/') {
      // relative URL
      try {
      const urlObj = new URL(`${baseUrl}${linkElement.href}`);
      Urls.push(urlObj.href);
      } catch (error) {
        console.error(`error with relative url: ${error.message}`);
      }
    } else {
      // absolute URL
      try {
      const urlObj = new URL(linkElement.href);
      Urls.push(urlObj.href);
      } catch (error) {
        console.error(`error with absolute url: ${error.message}`);
      }
    } 
  }
  return Urls;
}

function normalizeUrl(urlString) {
  const urlObj = new URL(urlString);
  const hostPath = `${urlObj.hostname}${urlObj.pathname}`;
  if (hostPath.length > 0 && hostPath.slice(-1) === '/') {
    return hostPath.slice(0, -1);
  }
  return hostPath;
}
module.exports = {
  normalizeUrl,
  getUrlFromHTML,
  crawlPage
}
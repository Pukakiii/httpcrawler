const { JSDOM } = require('jsdom');

async function crawlPage(baseURL, currentURL, pages) {
  
  baseURLObj = new URL(baseURL);
  currentURLObj = new URL(currentURL);
  if (baseURLObj.hostname !== currentURLObj.hostname) {
    return pages;
  }

  const normalizedCurrentURL = normalizeUrl(currentURL);
  if (pages[normalizedCurrentURL] > 0) {
    pages[normalizedCurrentURL]++;
    return pages;
  }

  pages[normalizedCurrentURL] = 1;

  console.log(`Crawling ${currentURL}`);

  try {
  const resp = await fetch(currentURL);
  
  if (resp.status > 399) {
    console.error(`Error fetching ${currentURL}: ${resp.status}`);
    return pages;
  }
 
  const contentType = resp.headers.get('content-type');
  if (!contentType.includes('text/html')) {
    console.log(`Error fetching ${currentURL}: ${resp.status}, not HTML`);
    return pages;
  }

  const htmlBody = await resp.text();
  
  const nextUrls = getUrlFromHTML(htmlBody, baseURL);

  for (const nextUrl of nextUrls) {
    pages = await crawlPage(baseURL, nextUrl, pages);
  }

  } catch (error) {
    console.error(`Error fetching ${currentURL}: ${error.message}, status: ${error.status}`);
  }
  return pages;
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
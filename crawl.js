const { JSDOM } = require('jsdom');

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
  getUrlFromHTML
}
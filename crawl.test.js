const {normalizeUrl, getUrlFromHTML} = require('./crawl.js');
const {test, expect} = require('@jest/globals');

test('normalizeUrl strip protocol', () => {
  const input = 'https://blog.boot.dev/path';
  const actual = normalizeUrl(input);
  const expected = 'blog.boot.dev/path';
  expect(actual).toEqual(expected);
});

test('normalizeUrl strip trailing slash', () => {
  const input = 'https://blog.boot.dev/path/';
  const actual = normalizeUrl(input);
  const expected = 'blog.boot.dev/path';
  expect(actual).toEqual(expected);
});

test('normalizeUrl capitals', () => {
  const input = 'https://BLOG.boot.dev/path/';
  const actual = normalizeUrl(input);
  const expected = 'blog.boot.dev/path';
  expect(actual).toEqual(expected);
});

test('normalizeUrl strip http', () => {
  const input = 'http://BLOG.boot.dev/path/';
  const actual = normalizeUrl(input);
  const expected = 'blog.boot.dev/path';
  expect(actual).toEqual(expected);
});

test('getURLsfromHTML absolute', () => {
  const inputHtmlBody = `
  <html>
    <head>
      <title>Test</title>
    </head>
    <body>
      <a href="https://blog.boot.dev/">Link</a>
    </body>
  </html>
  `
  const inputBaseUrl = 'https://blog.boot.dev';
  const actual = getUrlFromHTML(inputHtmlBody, inputBaseUrl); 
  const expected = ['https://blog.boot.dev/'];
  expect(actual).toEqual(expected);
});

test('getURLsfromHTML relative', () => {
  const inputHtmlBody = `
  <html>
    <head>
      <title>Test</title>
    </head>
    <body>
      <a href="/path">Link</a>
    </body>
  </html>
  `
  const inputBaseUrl = 'https://blog.boot.dev';
  const actual = getUrlFromHTML(inputHtmlBody, inputBaseUrl); 
  const expected = ['https://blog.boot.dev/path'];
  expect(actual).toEqual(expected);
});

test('getURLsfromHTML both', () => {
  const inputHtmlBody = `
  <html>
    <head>
      <title>Test</title>
    </head>
    <body>
      <a href="https://blog.boot.dev/path1">Link 1</a>
      <a href="/path2">Link 2</a>
    </body>
  </html>
  `
  const inputBaseUrl = 'https://blog.boot.dev';
  const actual = getUrlFromHTML(inputHtmlBody, inputBaseUrl); 
  const expected = ['https://blog.boot.dev/path1', 'https://blog.boot.dev/path2'];
  expect(actual).toEqual(expected);
});


test('getURLsfromHTML invalid', () => {
  const inputHtmlBody = `
  <html>
    <head>
      <title>Test</title>
    </head>
    <body>
      <a href="invalid">Link</a>
    </body>
  </html>
  `
  const inputBaseUrl = 'https://blog.boot.dev';
  const actual = getUrlFromHTML(inputHtmlBody, inputBaseUrl); 
  const expected = [];
  expect(actual).toEqual(expected);
});
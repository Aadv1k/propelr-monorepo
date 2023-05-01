import puppeteer from 'puppeteer';
import { writeFileSync, mkdirSync, existsSync, readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import path from "node:path";

const CACHE_DIR = path.join(__dirname, "html-cache");
const TIMEOUT_IN_MS = 6e5 // 10 minutes

function cacheHtml(html: string, url: string): void {
  try {
    mkdirSync(CACHE_DIR);
  } catch {};

  const dateInMS = Date.now();
  const fp = path.join(CACHE_DIR, `${createHash("md5").update(url).digest("hex")}.json`);

  writeFileSync(fp, JSON.stringify({
    cachedAt: dateInMS,
    content: html
  }))
}

async function fetchHtml(url: string): Promise<string> {
  const browser = await puppeteer.launch({headless: "new"});
  const page = await browser.newPage();
  await page.setExtraHTTPHeaders({ 'user-agent': 'mozilla/5.0 (windows nt 10.0; win64; x64; rv:109.0) gecko/20100101 firefox/112.0w'});
  await page.goto(url, { waitUntil: 'networkidle2' });
  let html = await page.content();
  browser.close();
  return html
}


export default async function fetchAndCacheHtml(url: string): Promise<string> {
  const hashedUrl = createHash("md5").update(url).digest("hex");
  const cacheTarget = path.join(CACHE_DIR, `${hashedUrl}.json`);

  if (existsSync(cacheTarget)) {
    const data = JSON.parse(readFileSync(cacheTarget, "utf-8"));
    if ((Date.now() - data.cachedAt) < TIMEOUT_IN_MS) {
      return data.content;
    }
  }

  const html = await fetchHtml(url);
  cacheHtml(html, url);

  return html;
}



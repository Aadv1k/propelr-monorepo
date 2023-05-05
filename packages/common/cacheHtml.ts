import puppeteer from 'puppeteer';
import { writeFileSync, mkdirSync, existsSync, readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import path from "node:path";
import https from "node:https";

const CACHE_DIR = path.join(__dirname, "html-cache");
const TIMEOUT_IN_MS = 6e5 + (6e4 * 5) // 10 minutes + 5 minutes

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

function GET(url: string): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`Failed to fetch URL (${res.statusCode}): ${url}`));
        return;
      }
      let data = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve(data);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

async function injectCSS(url: string, page: any) {
  const css = await GET(url)
  await page.addStyleTag({ content: css });
}

async function fetchHtml(baseUrl: string): Promise<string> {
  const browser = await puppeteer.launch({headless: "new"});
  const page = await browser.newPage();
  await page.setExtraHTTPHeaders({ 'user-agent': 'mozilla/5.0 (windows nt 10.0; win64; x64; rv:109.0) gecko/20100101 firefox/112.0w'});
  await page.goto(baseUrl, { waitUntil: 'networkidle2' });

  // Get all stylesheet links
  let stylesheets = await page.$$eval('link[rel="stylesheet"]', links => {
    return links.map(e => e.getAttribute('href'));
  }
  );

  stylesheets = stylesheets.filter(e => e).map((e: any) => {
    try {
      new URL(e)
      return e;
    }  catch {
      return new URL(e, baseUrl).href;
    }
  })


  for (const cssLink of stylesheets) {
    await injectCSS(cssLink as string, page)
  }

  let html = await page.content();
  browser.close();
  return html
}

export default async function fetchAndCacheHtml(url: string, timeout?: number): Promise<{
  cachedAt: number,
  content: string,
}> {
  const hashedUrl = createHash("md5").update(url).digest("hex");
  const cacheTarget = path.join(CACHE_DIR, `${hashedUrl}.json`);

  if (existsSync(cacheTarget)) {
    const data = JSON.parse(readFileSync(cacheTarget, "utf-8"));
    if ((Date.now() - data.cachedAt) < (timeout || TIMEOUT_IN_MS)) {
      console.log("[INFO] /api/scraper: Cache HIT")
      return {
        cachedAt: data.cachedAt,
        content: data.content
      }
    }
  }

  const html = await fetchHtml(url);
  cacheHtml(html, url);

  return {
    cachedAt: Date.now(),
    content: html
  };

}



import { PlaywrightCrawler, downloadListOfUrls } from "crawlee";
import { readFile, writeFile } from "fs/promises";
import { readFileSync } from 'fs';
import { glob } from "glob";
import { Config, configSchema } from "./config.js";
import { Page } from "playwright";

let pageCounter = 0;

export function getPageHtml(page: Page, selector = "body") {
  return page.evaluate((selector) => {
    if (selector.startsWith("/")) {
      const elements = document.evaluate(
        selector,
        document,
        null,
        XPathResult.ANY_TYPE,
        null
      );
      let result = elements.iterateNext();
      return result ? result.textContent || "" : "";
    } else {
      const el = document.querySelector(selector) as HTMLElement | null;
      return el?.innerText || "";
    }
  }, selector);
}

export async function waitForXPath(page: Page, xpath: string, timeout: number) {
  await page.waitForFunction(
    (xpath) => {
      const elements = document.evaluate(
        xpath,
        document,
        null,
        XPathResult.ANY_TYPE,
        null
      );
      return elements.iterateNext() !== null;
    },
    xpath,
    { timeout }
  );
}

export async function crawl(config: Config) {
  configSchema.parse(config);

  if (process.env.NO_CRAWL !== "true") {
    const crawler = new PlaywrightCrawler({
      async requestHandler({ request, page, enqueueLinks, log, pushData }) {
        if (config.cookie) {
          const cookie = {
            name: config.cookie.name,
            value: config.cookie.value,
            url: request.loadedUrl,
          };
          await page.context().addCookies([cookie]);
        }

        const title = await page.title();
        pageCounter++;
        log.info(
          `Crawling: Page ${pageCounter} / ${config.maxPagesToCrawl} - URL: ${request.loadedUrl}...`
        );

        if (config.selector) {
          if (config.selector.startsWith("/")) {
            await waitForXPath(
              page,
              config.selector,
              config.waitForSelectorTimeout ?? 1000
            );
          } else {
            await page.waitForSelector(config.selector, {
              timeout: config.waitForSelectorTimeout ?? 1000,
            });
          }
        }

        const html = await getPageHtml(page, config.selector);
        await pushData({ title, url: request.loadedUrl, html });

        if (config.onVisitPage) {
          await config.onVisitPage({ page, pushData });
        }

        if (config.crawlInterval) {
          await new Promise(resolve => setTimeout(resolve, config.crawlInterval));
        }

        await enqueueLinks({
          globs: typeof config.match === "string" ? [config.match] : config.match,
        });
      },
      maxRequestsPerCrawl: config.maxPagesToCrawl,
      preNavigationHooks: [
        async ({ page, log }) => {
          const RESOURCE_EXCLUSTIONS = config.resourceExclusions ?? [];
          if (RESOURCE_EXCLUSTIONS.length === 0) {
            return;
          }
          await page.route(`**\/*.{${RESOURCE_EXCLUSTIONS.join()}}`, (route) => route.abort("aborted"));
          log.info(`Aborting requests for as this is a resource excluded route`);
        },
      ],
    });

    if (config.crawlFromLinksFile && config.linksFileName) {
      const links = readFileSync(config.linksFileName, 'utf-8').split('\n').filter(Boolean);
      await crawler.addRequests(links.map(url => ({ url })));
    } else if (config.url.endsWith("sitemap.xml")) {
      const listOfUrls = await downloadListOfUrls({ url: config.url });
      await crawler.addRequests(listOfUrls);
    } else {
      await crawler.run([config.url]);
    }

    await crawler.run();
  }
}

export async function write(config: Config) {
  configSchema.parse(config);

  const jsonFiles = await glob("storage/datasets/default/*.json", {
    absolute: true,
  });

  const results = [];
  for (const file of jsonFiles) {
    const data = JSON.parse(await readFile(file, "utf-8"));
    results.push(data);
  }

  await writeFile(config.outputFileName, JSON.stringify(results, null, 2));
}

#!/usr/bin/env node

import { program } from "commander";
import { Config } from "./config.js";
import { crawl, write } from "./core.js";
import { createRequire } from "node:module";
import inquirer from "inquirer";

const require = createRequire(import.meta.url);
const { version, description } = require("../../package.json");

const messages = {
  url: "What is the first URL of the website you want to crawl?",
  match: "What is the URL pattern you want to match?",
  selector: "What is the CSS selector you want to match?",
  maxPagesToCrawl: "How many pages do you want to crawl?",
  outputFileName: "What is the name of the output file?",
  crawlInterval: "What is the time interval (in ms) between page crawls?",
  crawlFromLinksFile: "Do you want to crawl from a links file? (yes/no)",
  linksFileName: "What is the name of the links file?"
};

async function handler(options: any) {
  try {
    const {
      url,
      match,
      selector,
      maxPagesToCrawl: maxPagesToCrawlStr,
      outputFileName,
      crawlInterval: crawlIntervalStr = "1000",
      crawlFromLinksFile: crawlFromLinksFileStr = "no",
      linksFileName
    } = options;

    const maxPagesToCrawl = parseInt(maxPagesToCrawlStr.toString(), 10);
    const crawlInterval = parseInt(crawlIntervalStr.toString(), 10);
    const crawlFromLinksFile = crawlFromLinksFileStr.toString().toLowerCase() === 'yes';

    let config: Config = {
      url,
      match,
      selector,
      maxPagesToCrawl,
      outputFileName,
      crawlInterval,
      crawlFromLinksFile,
      linksFileName
    };

    const questions = [];

    if (!config.url) {
      questions.push({
        type: "input",
        name: "url",
        message: messages.url,
      });
    }

    if (!config.match) {
      questions.push({
        type: "input",
        name: "match",
        message: messages.match,
      });
    }

    if (!config.selector) {
      questions.push({
        type: "input",
        name: "selector",
        message: messages.selector,
      });
    }

    const answers = await inquirer.prompt(questions);

    config = {
      ...config,
      ...answers
    };

    await crawl(config);
    await write(config);
  } catch (error) {
    console.error(error);
  }
}

program.version(version).description(description);

program
  .option("-u, --url <string>", messages.url, "")
  .option("-m, --match <string>", messages.match, "")
  .option("-s, --selector <string>", messages.selector, "")
  .option("-mp, --maxPagesToCrawl <number>", messages.maxPagesToCrawl, "50")
  .option("-o, --outputFileName <string>", messages.outputFileName, "output.json")
  .option("-ci, --crawlInterval <number>", messages.crawlInterval, "1000")
  .option("-cf, --crawlFromLinksFile <string>", messages.crawlFromLinksFile, "no")
  .option("-lf, --linksFileName <string>", messages.linksFileName, "links.txt")
  .action(handler);

program.parse();

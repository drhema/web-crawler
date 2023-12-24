import { Config } from "./src/config";

export const defaultConfig: Config = {
  url: "https://goldencouponz.com/",
  match: "https://goldencouponz.com/store/**",
  maxPagesToCrawl: 100,
  outputFileName: "golden_custom.json",
  crawlInterval: 2000, // 2 seconds interval
  crawlFromLinksFile: true, // Enable crawling from links file
  linksFileName: "links.txt" // Name of the links file
};
//npx playwright install
//npm start
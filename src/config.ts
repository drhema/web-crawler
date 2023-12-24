import { z } from "zod";
import type { Page } from "playwright";

const Page: z.ZodType<Page> = z.any();

export const configSchema = z.object({
  /**
   * URL to start the crawl, if url is a sitemap, it will crawl all pages in the sitemap
   * @example "https://www.builder.io/c/docs/developers"
   * @example "https://www.builder.io/sitemap.xml"
   * @default ""
   */
  url: z.string(),

  /**
   * Pattern to match against for links on a page to subsequently crawl
   * @example "https://www.builder.io/c/docs/**"
   * @default ""
   */
  match: z.string().or(z.array(z.string())),

  /**
   * Selector to grab the inner text from
   * @example ".docs-builder-container"
   * @default ""
   */
  selector: z.string().optional(),

  /**
   * Don't crawl more than this many pages
   * @default 50
   */
  maxPagesToCrawl: z.number().int().positive(),

  /**
   * File name for the finished data
   * @default "output.json"
   */
  outputFileName: z.string(),

  /** Optional cookie to be set. E.g. for Cookie Consent */
  cookie: z
    .object({
      name: z.string(),
      value: z.string(),
    })
    .optional(),

  /** Optional function to run for each page found */
  onVisitPage: z
    .function()
    .args(
      z.object({
        page: Page,
        pushData: z.function().args(z.any()).returns(z.promise(z.void())),
      }),
    )
    .returns(z.promise(z.void()))
    .optional(),

  /** Optional timeout for waiting for a selector to appear */
  waitForSelectorTimeout: z.number().int().nonnegative().optional(),

  /** Optional resources to exclude */
  resourceExclusions: z.array(z.string()).optional(),

  /** Time interval in milliseconds between crawling each page */
  crawlInterval: z.number().int().nonnegative().optional(),

  /** Whether to crawl only from a links file */
  crawlFromLinksFile: z.boolean().optional(),

  /** Name of the links file, if crawlFromLinksFile is true */
  linksFileName: z.string().optional(),
});

export type Config = z.infer<typeof configSchema>;

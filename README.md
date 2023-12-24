# WEB Crawler <!-- omit from toc -->

Crawl a site to generate knowledge files to create your own json from one or multiple URLs


## Get started

### Running locally

#### Clone the repository

Be sure you have Node.js >= 16 installed.

```sh
git clone https://github.com/builderio/gpt-crawler
```

#### Install dependencies

```sh
npm i
```

#### Configure the crawler

Open [config.ts](config.ts) and edit the `url` and `selector` properties to match your needs.

E.g. to crawl the Builder.io docs to make our custom GPT you can use:

```ts
export const defaultConfig: Config = {
  url: "https://www.builder.io/c/docs/developers",
  match: "https://www.builder.io/c/docs/**",
  selector: `.docs-builder-container`,
  maxPagesToCrawl: 50,
  outputFileName: "output.json",
};
```

See [config.ts](src/config.ts) for all available options. Here is a sample of the common configuration options:

```ts
type Config = {
  /** URL to start the crawl, if sitemap is provided then it will be used instead and download all pages in the sitemap */
  url: string;
  /** Pattern to match against for links on a page to subsequently crawl */
  match: string;
  /** Selector to grab the inner text from */
  selector: string;
  /** Don't crawl more than this many pages */
  maxPagesToCrawl: number;
  /** File name for the finished data */
  outputFileName: string;
  /** Optional resources to exclude
   *
   * @example
   * ['png','jpg','jpeg','gif','svg','css','js','ico','woff','woff2','ttf','eot','otf','mp4','mp3','webm','ogg','wav','flac','aac','zip','tar','gz','rar','7z','exe','dmg','apk','csv','xls','xlsx','doc','docx','pdf','epub','iso','dmg','bin','ppt','pptx','odt','avi','mkv','xml','json','yml','yaml','rss','atom','swf','txt','dart','webp','bmp','tif','psd','ai','indd','eps','ps','zipx','srt','wasm','m4v','m4a','webp','weba','m4b','opus','ogv','ogm','oga','spx','ogx','flv','3gp','3g2','jxr','wdp','jng','hief','avif','apng','avifs','heif','heic','cur','ico','ani','jp2','jpm','jpx','mj2','wmv','wma','aac','tif','tiff','mpg','mpeg','mov','avi','wmv','flv','swf','mkv','m4v','m4p','m4b','m4r','m4a','mp3','wav','wma','ogg','oga','webm','3gp','3g2','flac','spx','amr','mid','midi','mka','dts','ac3','eac3','weba','m3u','m3u8','ts','wpl','pls','vob','ifo','bup','svcd','drc','dsm','dsv','dsa','dss','vivo','ivf','dvd','fli','flc','flic','flic','mng','asf','m2v','asx','ram','ra','rm','rpm','roq','smi','smil','wmf','wmz','wmd','wvx','wmx','movie','wri','ins','isp','acsm','djvu','fb2','xps','oxps','ps','eps','ai','prn','svg','dwg','dxf','ttf','fnt','fon','otf','cab']
   */
  resourceExclusions?: string[];
  /** Optional maximum file size in megabytes to include in the output file */
  maxFileSize?: number;
  /** Optional maximum number tokens to include in the output file */
  maxTokens?: number;
};
```

#### Run your crawler

```sh
npm start
```


## Contributing

Know how to make this project better? Send a PR!

<br>
<br>

<p align="center">
   <a href="https://www.builder.io/m/developers">
      <picture>
         <source media="(prefers-color-scheme: dark)" srcset="https://user-images.githubusercontent.com/844291/230786554-eb225eeb-2f6b-4286-b8c2-535b1131744a.png">
         <img width="250" alt="Made with love by Builder.io" src="https://user-images.githubusercontent.com/844291/230786555-a58479e4-75f3-4222-a6eb-74c5af953eac.png">
       </picture>
   </a>
</p>

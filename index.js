const Promise = require('bluebird');
const SerpApi = require('google-search-results-nodejs');
const puppeteer = require('puppeteer');

const API_KEY = ""
class Scraper {
    
    constructor() {
        this.serp = Promise.promisifyAll(new SerpApi.GoogleSearch(API_KEY));
        this.serpPr = Promise.promisifyAll(this.serp);
    };

    async scrape() {
        console.log(`-----------1`);
        console.log(JSON.stringify(this.serp));
        console.log(JSON.stringify(this.serpPr));

        const result = await this.serp.json({
            q: "Coffee",
            location: "Austin, TX"
        });
        console.log(result);

        console.log(`-----------2`);
   
        for (organicResult in result.organic_results) {
            const browser = await puppeteer.launch();
    
            const page = await browser.newPage();
            await page.goto(organicResult.link);
            const extractedText = await page.$eval('*', (el) => {
                const selection = window.getSelection();
                const range = document.createRange();
                range.selectNode(el);
                selection.removeAllRanges();
                selection.addRange(range);
                return window.getSelection().toString();
            });
            await page.close();
            console.log(extractedText);
        }
    
    };

}


new Scraper()
.scrape()
.then(() => console.log('Done'))
.catch(e => console.log(e.message)) 
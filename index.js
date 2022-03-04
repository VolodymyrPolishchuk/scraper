const Promise = require('bluebird');
const SerpApi = require('google-search-results-nodejs');
const puppeteer = require('puppeteer');

const API_KEY = "7527d0d30b30854373c19796cc1b932488a30bc81b92037fcaed72fda33851d5"
class Scraper {
    
    constructor() {
        this.serp = Promise.promisifyAll(new SerpApi.GoogleSearch(API_KEY));
    };

    async scrape() {
        console.log(`-----------1`);

        const result = await this.serp.jsonAsync({
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
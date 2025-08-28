import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import * as cheerio from 'cheerio';

puppeteer.use(StealthPlugin());

// Helper function to add a random delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms + Math.random() * 2000));

// Helper function to scrape a URL using a headless browser with stealth
const scrapeWithPuppeteer = async (url, timeout = 60000) => {
    let browser;
    try {
        browser = await puppeteer.launch({
            headless: 'new',
            ignoreHTTPSErrors: true,
            args: ['--ignore-certificate-errors', '--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
        
        await page.goto(url, { waitUntil: 'networkidle0', timeout: timeout });
        await delay(3000); // Wait for a few seconds to let content render
        
        const content = await page.content();
        return content;
    } catch (err) {
        console.error(`❌ Error fetching ${url}:`, err.message);
        return null;
    } finally {
        if (browser) await browser.close();
    }
};

// ---------------- GOOGLE ----------------
async function fetchGoogleJobs() {
    try {
        const url = "https://careers.google.com/jobs/results/?distance=50&q=intern";
        const content = await scrapeWithPuppeteer(url);
        if (!content) return [];
        const $ = cheerio.load(content);
        
        const jobs = $("li.gc-card").map((i, el) => ({
            title: $(el).find("h2").text().trim(),
            location: $(el).find(".gc-job-tags").text().trim(),
            link: "https://careers.google.com" + $(el).find("a").attr("href"),
        })).get();
        console.log(`✅ Google → Found ${jobs.length} internships`);
        return jobs;
    } catch (error) {
        console.error("❌ Error fetching Google jobs:", error.message);
        return [];
    }
}

// ---------------- MICROSOFT ----------------
async function fetchMicrosoftJobs() {
    try {
        const url = "https://jobs.careers.microsoft.com/global/en/search?et=Internship&l=en_us";
        const content = await scrapeWithPuppeteer(url);
        if (!content) return [];
        const $ = cheerio.load(content);

        const jobs = $("div.job-list-item").map((i, el) => ({
            title: $(el).find("a.job-title").text().trim(),
            location: $(el).find(".job-location").text().trim(),
            link: "https://jobs.careers.microsoft.com" + $(el).find("a").attr("href"),
        })).get();
        console.log(`✅ Microsoft → Found ${jobs.length} internships`);
        return jobs;
    } catch (error) {
        console.error("❌ Error fetching Microsoft jobs:", error.message);
        return [];
    }
}

// ---------------- ADOBE ----------------
async function fetchAdobeJobs() {
    try {
        const url = "https://adobe.wd5.myworkdayjobs.com/en-US/external_experienced/job?locations=IND&workerSubType=Intern";
        const content = await scrapeWithPuppeteer(url);
        if (!content) return [];
        const $ = cheerio.load(content);
        
        const jobs = $("div[data-automation-id='jobTitle']").map((i, el) => ({
            title: $(el).text().trim(),
            link: "https://adobe.wd5.myworkdayjobs.com" + $(el).find("a").attr("href"),
        })).get();
        console.log(`✅ Adobe → Found ${jobs.length} internships`);
        return jobs;
    } catch (error) {
        console.error("❌ Error fetching Adobe jobs:", error.message);
        return [];
    }
}

// ---------------- UBER ----------------
async function fetchUberJobs() {
    try {
        const url = "https://www.uber.com/global/en/careers/list/?keyword=intern";
        const content = await scrapeWithPuppeteer(url, 120000); 
        if (!content) return [];
        const $ = cheerio.load(content);
        
        const jobs = $("li.css-1q2dra3").map((i, el) => ({
            title: $(el).find("h3").text().trim(),
            location: $(el).find("p").text().trim(),
            link: "https://www.uber.com" + $(el).find("a").attr("href"),
        })).get();
        console.log(`✅ Uber → Found ${jobs.length} internships`);
        return jobs;
    } catch (error) {
        console.error("❌ Error fetching Uber jobs:", error.message);
        return [];
    }
}

// ---------------- NETFLIX ----------------
async function fetchNetflixJobs() {
    try {
        const url = "https://jobs.netflix.com/search?query=intern";
        const content = await scrapeWithPuppeteer(url);
        if (!content) return [];
        const $ = cheerio.load(content);
        
        const jobs = $("a.job-link").map((i, el) => ({
            title: $(el).find("h3").text().trim(),
            location: $(el).find("span").text().trim(),
            link: "https://jobs.netflix.com" + $(el).attr("href"),
        })).get();
        console.log(`✅ Netflix → Found ${jobs.length} internships`);
        return jobs;
    } catch (error) {
        console.error("❌ Error fetching Netflix jobs:", error.message);
        return [];
    }
}

// ---------------- RUN ALL ----------------
async function runAllScrapers() {
    console.log("🔥 Starting job scraper...");
    const [google, microsoft, adobe, uber, netflix] = await Promise.all([
        fetchGoogleJobs(),
        fetchMicrosoftJobs(),
        fetchAdobeJobs(),
        fetchUberJobs(),
        fetchNetflixJobs(),
    ]);

    const all = [...google, ...microsoft, ...adobe, ...uber, ...netflix];
    console.log(`\n🔥 All Scraped Jobs Count: ${all.length}`);
    return all;
}

runAllScrapers();
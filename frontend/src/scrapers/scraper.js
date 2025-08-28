import axios from "axios";
import * as cheerio from "cheerio";
import companies from "./companies.json" assert { type: "json" };

async function scrapeCompany(company) {
  try {
    const { data } = await axios.get(company.url, { timeout: 20000 });
    const $ = cheerio.load(data);

    const jobs = [];
    $(company.selectors.job).each((i, el) => {
      const title = $(el).find(company.selectors.title).text().trim();
      const link = $(el).find(company.selectors.link).attr("href");
      const fullLink = company.linkPrefix + link;

      if (title.toLowerCase().includes("intern")) {
        jobs.push({
          company: company.name,
          title,
          link: fullLink
        });
      }
    });

    console.log(`✅ ${company.name} → ${jobs.length} internships found`);
    jobs.forEach(job => console.log(job));
  } catch (err) {
    console.error(`❌ Error scraping ${company.name}:`, err.message);
  }
}

async function runAllScrapers() {
  for (const company of companies) {
    await scrapeCompany(company);
  }
}

// 👇 Add this so script runs directly
runAllScrapers();

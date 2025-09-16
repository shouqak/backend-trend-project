import cron from "node-cron";
import updatePlaces from "./scraper.js";

// كل يوم الساعة 3 صباحًا
cron.schedule("0 3 * * *", async () => {
  console.log("⏳ Running daily TikTok scraper...");
  await updatePlaces();
});
console.log("✅ Scraper run completed.");

export default cron;
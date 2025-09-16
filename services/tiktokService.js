// services/tiktokService.js
import puppeteer from "puppeteer";

/**
 * جلب الأماكن الترند من TikTok
 * كل عنصر يحتوي على:
 * - name: اسم المكان
 * - images: صور المكان (thumbnail)
 * - popularItems: كلمات شائعة من caption
 */
export async function getTrendingPlaces() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto("https://www.tiktok.com/tag/saudi?lang=en", {
    waitUntil: "networkidle2",
  });

  const videos = await page.evaluate(() => {
    const items = [];
    document
      .querySelectorAll(
        "div[data-e2e='challenge-item-list'] div[data-e2e='challenge-item']"
      )
      .forEach((el) => {
        const img = el.querySelector("img")?.src;
        const caption = el.querySelector("a")?.innerText || "";
        if (img) {
          items.push({ img, caption });
        }
      });
    return items;
  });

  const stopWords = ["في", "على", "من", "with", "the", "and", "عن"];
  const results = [];

  for (let v of videos) {
    const words = v.caption.split(/\s+/);
    const freq = {};
    for (let w of words) {
      const word = w.toLowerCase().replace(/[^a-zA-Zأ-ي0-9]/g, "");
      if (!word || stopWords.includes(word)) continue;
      freq[word] = (freq[word] || 0) + 1;
    }

    const popularItems = Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map((x) => x[0]);

    results.push({
      name: v.caption.split(" ")[0] || "Unknown",
      images: [v.img],
      popularItems,
    });
  }

  await browser.close();
  return results;
}

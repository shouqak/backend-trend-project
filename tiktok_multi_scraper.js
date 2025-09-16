import fs from "fs";
import fetch from "node-fetch";
import puppeteer from "puppeteer";

// 🔹 استخراج الكلمات الأكثر شهرة
function extractPopularItems(text) {
  const stopWords = new Set(["the", "and", "في", "على", "من", "with", "عن", "هذا"]);
  const words = text.toLowerCase().match(/\w+/g) || [];

  const freq = {};
  for (const w of words) {
    if (!stopWords.has(w)) {
      freq[w] = (freq[w] || 0) + 1;
    }
  }

  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([word]) => word);
}

// 🔹 تحويل اسم المكان لإحداثيات
async function geocodeLocation(placeName) {
  if (!placeName) return { lat: null, lng: null };

  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
    placeName
  )}&format=json&limit=1`;

  const res = await fetch(url, { headers: { "User-Agent": "tiktok-places-bot" } });
  const data = await res.json();

  if (data.length > 0) {
    return { lat: data[0].lat, lng: data[0].lon };
  }

  return { lat: null, lng: null };
}

// 🔹 سحب مقاطع من هاشتاق واحد
async function fetchTikTokFromHashtag(url) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(url, { waitUntil: "networkidle2" });

  // استخرج البيانات من الصفحة
  const videos = await page.evaluate(() => {
    const results = [];
    const items = document.querySelectorAll("div[data-e2e='search-card']");

    items.forEach((el) => {
      const description = el.querySelector("a[data-e2e='search-card-desc']")?.innerText || "";
      const thumbnail = el.querySelector("img")?.src || "";
      const hashtags = Array.from(el.querySelectorAll("a")).map((a) => a.innerText);

      results.push({
        description,
        hashtags,
        thumbnail,
        place: description.match(/(Riyadh|Jeddah|Cafe|Restaurant)/i)?.[0] || "Unknown",
        category: hashtags.includes("cafe") ? "Cafe" : "Food",
      });
    });

    return results;
  });

  await browser.close();
  return videos;
}

// 🔹 العملية الرئيسية
async function main() {
  // 🔹 روابط الهاشتاقات (تقدر تزيد عليها)
  const hashtags = [
    "https://www.tiktok.com/tag/riyadhfood",
    "https://www.tiktok.com/tag/jeddahcafe",
    "https://www.tiktok.com/tag/saudiarabiafood"
  ];

  const results = [];

  for (const url of hashtags) {
    console.log(`🔍 Scraping from: ${url}`);
    const videos = await fetchTikTokFromHashtag(url);

    for (const v of videos) {
      const text = `${v.description} ${v.hashtags.join(" ")}`;
      const { lat, lng } = await geocodeLocation(v.place);

      results.push({
        place_name: v.place || "Unknown",
        lat,
        lng,
        category: v.category || "Unknown",
        popular_items: extractPopularItems(text),
        images: [v.thumbnail],
        source: "tiktok",
        hashtag_source: url
      });
    }
  }

  fs.writeFileSync("tiktok_places.json", JSON.stringify(results, null, 2), "utf-8");
  console.log("✅ tiktok_places.json updated with multiple hashtags!");
}

main().catch(console.error);

const { chromium } = require("playwright");
const { loadSeen, saveSeen } = require("./db");
const { formatBike } = require("./formatter");
const { sendBike } = require("./telegram");
const { sendBikeBatch } = require("./telegram");

async function checkBikes() {
  const seen = loadSeen();

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  const hour = new Date().getHours();

  if (hour < 5 || hour >= 22) {
    console.log("🌙 Night mode: skipping check");
    return;
  }

  try {
    console.log("🔄 checking...");

    await page.goto(process.env.URL, { timeout: 60000 });

    await page.waitForTimeout(3000);

    await page.click('button:has-text("Alles toestaan")').catch(() => {});

    await page.waitForSelector(".productTileDefault");

    const bikes = await page.evaluate(() => {
      return Array.from(document.querySelectorAll(".productTileDefault"))
        .map((item) => ({
          name: item
            .querySelector(".productTileDefault__productName")
            ?.innerText?.trim(),
          link: item.querySelector(".productTileDefault__productName")?.href,
          img: item.querySelector(".productTileDefault__image")?.src,
          components: item
            .querySelector(".productTileDefault__infoWrapper")
            ?.innerText?.trim(),
          priceSale: item
            .querySelector(".productTile__priceSale")
            ?.innerText?.trim(),
          priceOriginal: item
            .querySelector("s.productTile__priceOriginal")
            ?.innerText?.trim(),
          priceSave: item
            .querySelector(".productTile__priceSave")
            ?.innerText?.trim(),
          monthly: item
            .querySelector(".productTile__priceMonthly")
            ?.innerText?.trim(),
        }))
        .filter((b) => b.name && b.link);
    });

    console.log(`📦 found: ${bikes.length}`);

    let newItems = [];

    const newBikes = [];

    for (const bike of bikes) {
      if (!bike.link || seen.includes(bike.link)) continue;

      seen.push(bike.link);
      saveSeen(seen);

      const formatted = formatBike(bike);

      await sendBike(formatted);
      await delay(1500);

      newItems.push(bike);

      //   newBikes.push(formatBike(bike));
    }

    // for (let i = 0; i < newBikes.length; i += 5) {
    //   const chunk = newBikes.slice(i, i + 5);

    //   await sendBikeBatch(chunk);

    //   await delay(3000); // пауза между батчами
    // }

    console.log(`✨ new: ${newItems.length}`);
  } catch (e) {
    console.log("ERROR:", e.message);
  } finally {
    await browser.close();
  }
}

module.exports = { checkBikes };

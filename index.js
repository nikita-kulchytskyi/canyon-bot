require("dotenv").config();

const { checkBikes } = require("./scraper");

setInterval(checkBikes, 5 * 60 * 1000);
checkBikes();

// require("dotenv").config();

// const fs = require("fs");
// const { chromium } = require("playwright");
// const TelegramBot = require("node-telegram-bot-api");

// const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

// const DB_FILE = "seen.json";

// function formatBike(bike) {
//   const extractNumber = (text) => {
//     if (!text) return null;
//     const match = text.match(/\d{1,3}(?:\.\d{3})*/g);
//     if (!match) return null;
//     return parseFloat(match[0].replace(/\./g, ""));
//   };

//   const sale = extractNumber(bike.priceSale);
//   const original = extractNumber(bike.priceOriginal);

//   let discount = null;

//   if (sale && original && original > sale) {
//     discount = Math.round(((original - sale) / original) * 100);
//   }

//   return {
//     name: bike.name,
//     link: bike.link,
//     img: bike.img,
//     components: bike.components,
//     sale,
//     original,
//     discount,
//     saveText: bike.priceSave,
//     monthly: bike.monthly,
//   };
// }

// const loadSeen = () =>
//   fs.existsSync(DB_FILE) ? JSON.parse(fs.readFileSync(DB_FILE)) : [];

// const saveSeen = (data) =>
//   fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));

// async function checkBikes() {
//   const seen = loadSeen();

//   const browser = await chromium.launch({ headless: false });
//   const page = await browser.newPage();

//   try {
//     console.log("🔄 checking...");

//     await page.goto(process.env.URL, { timeout: 60000 });

//     await page.waitForTimeout(3000);

//     // cookies
//     await page.click('button:has-text("Alles toestaan")').catch(() => {});
//     await page.click('button:has-text("Alleen noodzakelijke")').catch(() => {});
//     await page.click('button:has-text("Close")').catch(() => {});

//     await page.waitForSelector(".productTileDefault", { timeout: 60000 });

//     const bikes = await page.evaluate(() => {
//       return Array.from(document.querySelectorAll(".productTileDefault"))
//         .map((item) => {
//           const name = item
//             .querySelector(".productTileDefault__productName")
//             ?.innerText?.trim();

//           const link = item.querySelector(
//             ".productTileDefault__productName",
//           )?.href;

//           const img =
//             item.querySelector(".productTileDefault__image")?.src ||
//             item
//               .querySelector(".productTileDefault__image")
//               ?.getAttribute("srcset")
//               ?.split(" ")[0];

//           const components = item
//             .querySelector(".productTileDefault__infoWrapper")
//             ?.innerText?.trim();

//           const priceSale = item
//             .querySelector(".productTile__priceSale")
//             ?.innerText?.trim();

//           const priceOriginal = item
//             .querySelector("s.productTile__priceOriginal")
//             ?.innerText?.trim();

//           const priceSave = item
//             .querySelector(".productTile__priceSave")
//             ?.innerText?.trim();

//           const monthly = item
//             .querySelector(".productTile__priceMonthly")
//             ?.innerText?.trim();

//           return {
//             name,
//             link,
//             img,
//             components,
//             priceSale,
//             priceOriginal,
//             priceSave,
//             monthly,
//           };
//         })
//         .filter((b) => b.name && b.link);
//     });

//     console.log(`📦 found: ${bikes.length}`);

//     let newItems = [];

//     for (const bike of bikes) {
//       if (!bike.link || seen.includes(bike.link)) continue;

//       seen.push(bike.link);
//       newItems.push(bike);

//       const b = formatBike(bike);

//       const caption =
//         `🚴 ${b.name}\n` +
//         (b.components ? `⚙️ ${b.components}\n` : "") +
//         `💰 New: ${b.sale ? b.sale + " €" : "N/A"}\n` +
//         (b.original ? `💸 Old: ${b.original} €\n` : "") +
//         (b.discount ? `🔥 Save: ${b.discount}%\n` : "") +
//         (b.saveText ? `💵 ${b.saveText}\n` : "") +
//         (b.monthly ? `📆 ${b.monthly}\n` : "") +
//         `🔗 ${b.link}`;

//       console.log("━━━━━━━━━━━━━━━━━━━━");
//       console.log("🚴", b.name);
//       console.log("💰", b.sale);
//       console.log("💸", b.original);
//       console.log("🔥", b.discount ? `${b.discount}% off` : "no discount");
//       console.log("━━━━━━━━━━━━━━━━━━━━");

//       try {
//         if (b.img?.startsWith("http")) {
//           await bot.sendPhoto(process.env.CHAT_ID, b.img, {
//             caption,
//             parse_mode: "Markdown",
//           });
//         } else {
//           await bot.sendMessage(process.env.CHAT_ID, caption);
//         }
//       } catch (e) {
//         console.log("TG error:", e.message);
//       }
//     }

//     if (newItems.length) saveSeen(seen);

//     console.log(`✨ new: ${newItems.length}`);
//   } catch (e) {
//     console.log("ERROR:", e.message);
//   } finally {
//     await browser.close();
//   }
// }

// // run loop
// setInterval(checkBikes, 5 * 60 * 1000);
// checkBikes();

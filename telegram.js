const TelegramBot = require("node-telegram-bot-api");

const bot = new TelegramBot(process.env.BOT_TOKEN);
const delay = (ms) => new Promise((res) => setTimeout(res, ms));
async function sendBike(b) {
  const caption =
    `🚴 ${b.name}\n` +
    (b.components ? `⚙️ ${b.components}\n` : "") +
    `💰 New: ${b.sale ? b.sale + " €" : "N/A"}\n` +
    (b.original ? `💸 Old: ${b.original} €\n` : "") +
    (b.discount ? `🔥 Save: ${b.discount}%\n` : "") +
    (b.priceSave ? `💵 ${b.priceSave}\n` : "") +
    (b.monthly ? `📆 ${b.monthly}\n` : "") +
    `🔗 ${b.link}`;

  //   if (b.img?.startsWith("http")) {
  //     await bot.sendPhoto(process.env.CHAT_ID, b.img, { caption });
  //   } else {
  //     await bot.sendMessage(process.env.CHAT_ID, caption);
  //   }

  try {
    if (b.img?.startsWith("http")) {
      await bot.sendPhoto(process.env.CHAT_ID, b.img, { caption });
    } else {
      await bot.sendMessage(process.env.CHAT_ID, caption);
    }
  } catch (e) {
    if (e.response?.body?.parameters?.retry_after) {
      const wait = e.response.body.parameters.retry_after * 1000;

      console.log(`⏳ Rate limit. Waiting ${wait / 1000}s...`);
      await delay(wait);

      // повторяем отправку
      if (b.img?.startsWith("http")) {
        await bot.sendPhoto(process.env.CHAT_ID, b.img, { caption });
      } else {
        await bot.sendMessage(process.env.CHAT_ID, caption);
      }
    } else {
      console.log("TG error:", e.message);
    }
  }
}

async function sendBikeBatch(bikes) {
  let text = "";

  for (const b of bikes) {
    text +=
      `🚴 ${b.name}\n` +
      (b.components ? `⚙️ ${b.components}\n` : "") +
      `💰 ${b.sale ? b.sale + " €" : "N/A"}`;

    if (b.original) text += ` → ${b.original} €`;
    if (b.discount) text += ` (-${b.discount}%)`;

    text += "\n";

    if (b.priceSave) text += `💵 ${b.priceSave}\n`;
    if (b.monthly) text += `📆 ${b.monthly}\n`;

    text += `🔗 ${b.link}\n\n`;
  }

  try {
    await bot.sendMessage(process.env.CHAT_ID, text);
  } catch (e) {
    if (e.response?.body?.parameters?.retry_after) {
      const wait = e.response.body.parameters.retry_after * 1000;

      console.log(`⏳ Rate limit. Waiting ${wait / 1000}s...`);
      await delay(wait);

      await bot.sendMessage(process.env.CHAT_ID, text);
    } else {
      console.log("TG error:", e.message);
    }
  }
}

module.exports = { sendBike, sendBikeBatch };

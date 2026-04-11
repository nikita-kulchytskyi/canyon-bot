const fs = require("fs");

const DB_FILE = "seen.json";

const loadSeen = () =>
  fs.existsSync(DB_FILE) ? JSON.parse(fs.readFileSync(DB_FILE)) : [];

const saveSeen = (data) =>
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));

module.exports = { loadSeen, saveSeen };

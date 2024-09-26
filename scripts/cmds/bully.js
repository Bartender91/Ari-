const axios = require('axios');
const storage = global?.temp?.toxic || new Map();
let fontEnabled = false;

function formatFont(text) {
  return text
}

function getUserHistory(userID) {
  if (!storage.has(userID)) {
    storage.set(userID, []);
  }
  return storage.get(userID);
}

function updateUserHistory(userID, role, content) {
  const history = getUserHistory(userID);
  history.push({ role, content });
  if (history.length > 8)
    history.slice();
  storage.set(userID, history);
}

async function processRequest(api, event, args, usersData, threadsData, message) {
  const question = args.join(' ');
  const userID = event.senderID;

  const GROQ_API_KEYS = [
  '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'
];
  const GROQ_API_KEY = GROQ_API_KEYS[Math.floor(Math.random() * GROQ_API_KEYS.length)];

  updateUserHistory(userID, 'user', question);

  await message.reaction("⏳", event.messageID)
  const userName = await usersData.getName(event.senderID);
const gcName = (await threadsData.get(event.threadID)).threadName;
  try {
    const response = await axios.post("https://gemini-4o.onrender.com/infer", {
      query: question,
      context: { history: getUserHistory(userID) },
      event,
      type: "toxic",
      opts: {
        event: { thread: { name: gcName }, sender: { name: userName, uid: userID } },
        key: GROQ_API_KEY,
        gkey: `AIzaSyAohQ6xsQJN--PmM75haHoauTHKbVnEvKA`,
      }
    });

    const answer = formatFont(response.data.cook.response);
    updateUserHistory(userID, 'assistant', response.data.cook.response);
    await message.reaction("✅", event.messageID);
    const replied = await message.reply(answer);
    GoatBot.onReply.set(replied.messageID, {
      author: event.senderID,
      commandName: "toxic",
      messageID: replied.messageID
    });
  } catch (error) {
    console.error(error);
    message.reply(formatFont(`Error: ${error.response?.data ||error.message}`));
    message.reaction("❌", event.messageID);
  }
}

function clearHistory(userID) {
  if (storage.has(userID)) {
    storage.delete(userID);
  }
}

module.exports.config = {
  name: "toxic",
  aliases: "bully",
  version: "1.0",
  role: 0,
  author: "Jsus",
  coolDown: 5,
  description: { en: "bullying" },
  category: "ai",
  guide: { en: "{pn} <prompt>" }
};

module.exports.onStart = async function({ api, event, args, usersData, threadsData, message }) {
  if (!args[0]) return message.reply("Nuh Uh")
  const userID = event.senderID;

  if (args[0] === "clear") {
    clearHistory(userID);
    return await message.reply("Context Reset")
  } else if (args[0] === "stats") {
    let dataJson = await axios.get("https://gemini-4o.onrender.com/stats");
    dataJson = JSON.stringify(dataJson.data, null, 2);
    return await message.reply(dataJson)
  }

  await processRequest(api, event, args, usersData, threadsData, message);
};

module.exports.onReply = async function({ api, event, args, usersData, threadsData, Reply, message }) {
  const userID = event.senderID;
  if (!args[0]) return;
  if (Reply.author !== userID) return;
  const prefix = await utils.getPrefix(event.threadID);
  if (args[0].startsWith(prefix)) return;
  if (Reply.messageID) delete GoatBot.onReply[Reply.messageID];
  if (args[0] === "clear") {
    clearHistory(userID);
    return await message.reply("Context Reset")
  }

  await processRequest(api, event, args, usersData, threadsData, message);
};
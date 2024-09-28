const axios = require('axios');

module.exports = {
  config: {
    name: "history",
    aliases: [],
    version: "1.0",
    author: "Morgan",
    countDown: 10,
    role: 0,
    shortDescription: "Search and know about history",
    longDescription: "Send information about historical events.",
    category: "info",
    guide: "{pn}history search_query",
  },

  onStart: async function ({ api, args, event }) {
    const searchQuery = args.join(" ");

    if (!searchQuery) {
      api.sendMessage("Please provide a search query (e.g., history Anglo-Nepal war).", event.threadID);
      return;
    }

    try {
      const response = await axios.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(searchQuery)}`);

      if (response.data.title && response.data.extract) {
        const { title, extract } = response.data;
        
        // Formatting the message for better structure and spacing
        const message = `===== *${title.toUpperCase()}* =====\n\n${extract}\n\n===============================`;

        api.sendMessage(message, event.threadID, event.messageID);
      } else {
        api.sendMessage(`No information found for "${searchQuery}".`, event.threadID, event.messageID);
      }
    } catch (error) {
      console.error("Error fetching historical information:", error);
      api.sendMessage("An error occurred while fetching historical information.", event.threadID, event.messageID);
    }
  }
};
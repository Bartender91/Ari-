const axios = require('axios');

module.exports = {
  config: {
    name: "wiki",
    version: "1.0",
    author: "Denver",
    countDown: 2,
    role: 1,
    shortDescription: {
      en: "Get a summary from Wikipedia"
    },
    longDescription: {
      en: "Retrieve a summary of a topic from Wikipedia using the MediaWiki API."
    },
    category: "knowledge",
    guide: {
      en: "To use the command, type {p}wikisummary [Topic]. For example, {p}wikisummary Artificial Intelligence. The bot will provide a summary sourced from Wikipedia."
    }
  },
  onStart: async function({ api, event, args }) {
    try {
      const topic = args.join(" ");
      const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(topic)}`;

      const response = await axios.get(url);

      if (response.status === 200) {
        const summary = response.data.extract;
        api.sendMessage(summary, event.threadID);
      } else {
        api.sendMessage("Sorry, failed to retrieve a summary for the topic.", event.threadID);
      }
    } catch (error) {
      api.sendMessage("Sorry, an error occurred while fetching the summary.", event.threadID);
    }
  }
};
const axios = require("axios");

module.exports = {
  config: {
    name: "movie",
    version: "1.1",
    author: "Morgan",
    countDown: 5,
    role: 0,
    shortDescription: {
      vi: "",
      en: ""
    },
    longDescription: {
      vi: "",
      en: ""
    },
    category: "information",
    guide: {
      vi: "{pn} movie name",
      en: "{pn} movie name"
    }
  },

  onStart: async function ({ api, args, event }) {
    const query = args.join(" ");

    if (!query) {
      api.sendMessage("Please provide a movie title.", event.threadID, event.messageID);
      return;
    }

    try {
      const res = await axios.get(`https://api.popcat.xyz/imdb?q=${encodeURIComponent(query)}`);

      if (res.data && res.data.title) {
        const { title, year, runtime, genres, director, actors, plot, poster } = res.data;

        // Formatting the message for better structure and spacing
        const movieInfo = `===== *${title.toUpperCase()}* =====\n\n` +
                          `🗓 Release Date: ${year}\n` +
                          `⏳ Runtime: ${runtime}\n` +
                          `🎬 Genres: ${genres}\n` +
                          `🎥 Director: ${director}\n` +
                          `🎭 Actors: ${actors}\n\n` +
                          `📖 Plot: ${plot}\n\n` +
                          `===============================`;

        // Sending the message with the movie poster as an attachment
        api.sendMessage({
          body: movieInfo,
          attachment: await global.utils.getStreamFromURL(poster)
        }, event.threadID, event.messageID);
      } else {
        api.sendMessage(`No movie found with the title "${query}".`, event.threadID, event.messageID);
      }

    } catch (error) {
      console.error("Error fetching movie information:", error);
      api.sendMessage("An error occurred while fetching movie information.", event.threadID, event.messageID);
    }
  }
};
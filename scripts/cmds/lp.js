const axios = require('axios');

module.exports = {
  config: {
    name: "lp",
    aliases: ["songlyrics"],
    version: "1.0",
    author: "Ethan Bartçzak",
    countDown: 30,
    role: 0,
    shortDescription: "Get Song Lyrics",
    longDescription: "Fetch the lyrics for any song",
    category: "Music",
    guide: "{pn} <song name>"
  },

  onStart: async function ({ api, event, args }) {
    // Join the provided song name from the arguments
    const songName = args.join(" ");
    
    if (!songName) {
      return api.sendMessage(`Please provide the name of the song you want lyrics for.`, event.threadID, event.messageID);
    }

    try {
      // Call the API with the dynamically provided song name
      const res = await axios.get(`https://api.popcat.xyz/lyrics?song=${encodeURIComponent(songName)}`);
      
      // Get lyrics, title, and artist from the response
      const lyrics = res.data.lyrics;
      const songTitle = res.data.title;
      const artist = res.data.artist;

      if (lyrics) {
        return api.sendMessage(`🎶 ${songTitle} by ${artist}\n\n${lyrics}`, event.threadID, event.messageID);
      } else {
        return api.sendMessage(`Sorry, I couldn't find the lyrics for "${songName}".`, event.threadID, event.messageID);
      }
    } catch (error) {
      return api.sendMessage(`An error occurred while fetching the lyrics for "${songName}". Please try again later.`, event.threadID, event.messageID);
    }
  }
};
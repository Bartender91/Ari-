const axios = require('axios');

module.exports = {
  config: {
    name: "snippet",
    version: "1.0",
    author: "Samir Œ",
    countDown: 5,
    role: 0,
    description: {
      vi: "",
      en: "Create an image."
    },
    category: "𝗗𝗘𝗩𝗘𝗟𝗢𝗣𝗘𝗥",
    guide: {
      vi: "{pn} <prompt> --t <title> --p <padding> --s <theme> --m <darkMode>",
      en: "{pn} <prompt> --t <title> --p <padding> --s <theme> --m <darkMode>"
    }
  },

  onStart: async function ({ api, event, args, message }) {
    let prompt = '';
    let title = 'Default Title';
    let padding = 64;
    let theme = 'ice';
    let darkMode = 'true';

    
    args.forEach((arg, index) => {
      if (arg === '--t' && args[index + 1]) {
        title = args[index + 1];
      } else if (arg === '--p' && args[index + 1]) {
        padding = parseInt(args[index + 1], 10);
      } else if (arg === '--s' && args[index + 1]) {
        theme = args[index + 1];
      } else if (arg === '--m' && args[index + 1]) {
        darkMode = args[index + 1];
      } else if (!arg.startsWith('--')) {
        prompt += arg + ' ';
      }
    });

    prompt = prompt.trim();

    if (!prompt) {
      return message.reply("Please provide a prompt.");
    }

    message.reply("Initializing image, please wait...", async (err, info) => {
      let id = info.messageID;
      try {
        
        const domainPart1 = 'https://www.samirxpikachu';
        const domainPart2 = '.run';
        const domainPart3 = '.place';

        
        const API = `${domainPart1}${domainPart2}${domainPart3}/senet?code=${encodeURIComponent(prompt)}&title=${encodeURIComponent(title)}&theme=${encodeURIComponent(theme)}&padding=${padding}&language=auto&darkMode=${darkMode}`;
        
        const imageStream = await global.utils.getStreamFromURL(API);
        message.unsend(id);
        message.reply({
          body: `  `,
          attachment: imageStream
        }, async (err, info) => {
        });
      } catch (error) {
        console.error(error);
        api.sendMessage(`Error: ${error}`, event.threadID);
      }
    });
  }
};
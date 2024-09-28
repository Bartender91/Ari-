const axios = require("axios");
const path = require("path");
const fs = require("fs-extra");

const Prefixes = ["lover", "git", "Aix"];

module.exports = {
  config: {
    name: "p",
    version: "2.2.4",
    author: "Hassan", // do not change
    role: 0,
    category: "ai",
    shortDescription: {
      en: "Asks AI for an answer.",
    },
    longDescription: {
      en: "Asks AI for an answer based on the user prompt.",
    },
    guide: {
      en: `{pn} [prompt]

Example usage:
1. To ask the AI a question:
   - {pn} What is the meaning of life?

3. To fetch images:
   - {pn} etc, images image of 
   - {pn} AI send me images of nature.
   
4. To fetch waifu images:
   - {pn} waifu maid
   - {pn} waifu raiden-shogun

Available versatile waifu tags:
maid, waifu, marin-kitagawa, mori-calliope, raiden-shogun, oppai, selfies, uniform, kamisato-ayaka

Available NSFW waifu tags:
ass, hentai, milf, oral, paizuri, ecchi, ero`
    },
  },
  onStart: async function ({ message, api, event, args }) {
 
  },
  onChat: async function ({ api, event, args, message }) {
    try {
      const prefix = Prefixes.find(
        (p) => event.body && event.body.toLowerCase().startsWith(p)
      );

      if (!prefix) {
        return;
      }

      let prompt = event.body.substring(prefix.length).trim();

      let numberImages = 6; // Default to 6 images
      const match = prompt.match(/-(\d+)$/);

      if (match) {
        numberImages = Math.min(parseInt(match[1], 10), 8); // Max 8 images
        prompt = prompt.replace(/-\d+$/, "").trim(); 
      }

      if (prompt === "") {
        await api.sendMessage(
          "Kindly provide the question at your convenience and I shall strive to deliver an effective response. Your satisfaction is my top priority.",
          event.threadID
        );
        return;
      }

      api.setMessageReaction("⌛", event.messageID, () => {}, true);

      const response = await axios.get(
        `https://llama3-cv-shassan.onrender.com/llama3?prompt=${encodeURIComponent(prompt)}`
      );

      console.log("API Response:", response.data); 

      if (response.status !== 200 || !response.data || !response.data.response) {
        throw new Error("Unable to respond");
      }

      const messageText = response.data.response;

      const urls = messageText.match(/https?:\/\/\S+\.(jpg|jpeg|png|gif)/gi);

      if (urls && urls.length > 0) {
        const imgData = [];
        const limitedUrls = urls.slice(0, numberImages);

        for (let i = 0; i < limitedUrls.length; i++) {
          const imgResponse = await axios.get(limitedUrls[i], {
            responseType: "arraybuffer",
          });
          const imgPath = path.join(__dirname, "cache", `image_${i + 1}.jpg`);
          await fs.outputFile(imgPath, imgResponse.data);
          imgData.push(fs.createReadStream(imgPath));
        }

        await api.sendMessage(
          {
            body: `HERE IS YOUR RESULTS✅`,
            attachment: imgData,
          },
          event.threadID,
          event.messageID
        );

        await fs.remove(path.join(__dirname, "cache"));
      } else {
        await message.reply(messageText);
      }

      api.setMessageReaction("✅", event.messageID, () => {}, true);
    } catch (error) {
      console.error("Error in onChat:", error);
      await api.sendMessage(
        `Failed to get answer: ${error.message}`,
        event.threadID
      );
    }
  },
};
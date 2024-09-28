.cmd install word.js const axios = require('axios');

module.exports = {
  config: {
    name: 'word',
    aliases: ['dic', 'define', 'meaning', 'what is'],
    version: '1.2',
    author: 'Denver~Morgan',
    role: 0,
    category: 'utility',
    shortDescription: {
      en: 'Explore meanings, synonyms, and antonyms of any word!'
    },
    longDescription: {
      en: 'This command lets you quickly look up the definition, synonyms, and antonyms of any word using a reliable dictionary source. Perfect for writers, students, and anyone curious about language.'
    },
    guide: {
      en: `✨ **Word Command Guide:**
      
      - Use: {pn} <word>
      - Example: {pn} happiness
      - Description: Retrieves the definition, synonyms, and antonyms of the word.

      Use this command to enhance your vocabulary and understanding of words! 🌟`
    }
  },

  onStart: async function ({ api, event, args }) {
    const word = args.join(' ').toLowerCase();

    if (!word) {
      return api.sendMessage('Please provide a word to look up! 🔍', event.threadID);
    }

    try {
      const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
      const wordResponse = await axios.get(url);

      if (wordResponse.status !== 200 || !wordResponse.data || !wordResponse.data[0]) {
        throw new Error('No information found.');
      }

      const data = wordResponse.data[0];
      const definition = data.meanings[0].definitions[0].definition;
      const partOfSpeech = data.meanings[0].partOfSpeech;
      const example = data.meanings[0].definitions[0].example || 'No example available.';
      const synonyms = data.meanings[0].definitions[0].synonyms || [];
      const antonyms = data.meanings[0].definitions[0].antonyms || [];

      // Build the message to include the definition, synonyms, and antonyms
      let message = `🌟 **Word:** *${word}*\n\n📖 **Definition:** ${definition}\n🗣 **Part of Speech:** ${partOfSpeech}\n💬 **Example:** ${example}`;
      
      if (synonyms.length > 0) {
        message += `\n\n🔄 **Synonyms:** ${synonyms.join(', ')}`;
      } else {
        message += `\n\n🔄 **Synonyms:** No synonyms available.`;
      }

      if (antonyms.length > 0) {
        message += `\n\n🔁 **Antonyms:** ${antonyms.join(', ')}`;
      } else {
        message += `\n\n🔁 **Antonyms:** No antonyms available.`;
      }

      const resultMessageID = await api.sendMessage(message, event.threadID);

      if (!resultMessageID) {
        throw new Error('Failed to send the word information.');
      }

      console.log(`Information for '${word}' sent successfully with message ID ${resultMessageID}`);
    } catch (error) {
      console.error(`Failed to fetch the word information: ${error.message}`);
      api.sendMessage('😔 Sorry, I couldn’t find the information for that word. Please try again with a different word!', event.threadID);
    }
  }
};
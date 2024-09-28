const axios = require('axios'); // Ensure axios is installed

module.exports = {
  config: {
    name: "snake",
    version: "1.0",
    author: "Morgan",
    countDown: 5,
    role: 0,
    shortDescription: "Get facts about a specific snake",
    longDescription: "Allows users to search for facts about a specific snake by name from Wikipedia",
    category: "Facts",
    guide: "{p}{n} <snake_name>"
  },
  onStart: async function ({ event, api, args }) {
    // Ensure that a snake name is provided by the user
    if (args.length === 0) {
      return api.sendMessage("Please provide the name of the snake you want to search for, e.g., 'Python'.", event.threadID);
    }

    // Join the arguments to form the full snake name (in case it's more than one word)
    const snakeName = args.join(" ");

    // Wikipedia API URL for fetching snake facts
    const wikipediaApiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(snakeName)}`;

    try {
      // Make an API request to Wikipedia to get a summary of the snake
      const response = await axios.get(wikipediaApiUrl);

      // Check if a valid response was received
      if (response.data && response.data.extract) {
        // Extract the summary (extract) from the response
        const snakeFact = response.data.extract;

        // Format the response message to make it more presentable
        const formattedMessage = `
-------------------
🐍 **Facts About "${snakeName}":** 🐍
-------------------

**Summary**:
${snakeFact}

-------------------
🌍 **Source**: Wikipedia
📖 **Read more**: ${response.data.content_urls.desktop.page}
-------------------
`;

        // Send the formatted response to the user
        api.sendMessage(formattedMessage, event.threadID);
      } else {
        // Handle the case where the Wikipedia article does not exist or no summary is available
        api.sendMessage(`Sorry, I couldn't find any information about "${snakeName}". Please check the spelling or try a different snake.`, event.threadID);
      }
    } catch (error) {
      // Handle any errors in the API request
      api.sendMessage(`Sorry, I couldn't retrieve facts for "${snakeName}" right now. Please try again later.`, event.threadID);
      console.error(error);
    }
  }
};
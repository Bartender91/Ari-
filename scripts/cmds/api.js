const axios = require('axios');

module.exports = {
  config: {
    name: "api",
    version: "1.0",
    author: "Morgan",
    countDown: 5,
    role: 2,
    shortDescription: "Evaluate code to test API",
    longDescription: "Test your API by evaluating the code.",
    category: "utility",
    guide: "{p}{n} <API URL> <query>"
  },
  onStart: async function ({ args, event, api }) {
    try {
      // Extract the API URL and query from the arguments
      const [apiUrl, ...queryParts] = args;
      const query = queryParts.join(" ");

      if (!apiUrl) {
        return api.sendMessage("Please provide an API URL to test.", event.threadID, event.messageID);
      }

      if (!query) {
        return api.sendMessage("Please provide a query to send to the API.", event.threadID, event.messageID);
      }

      // Check if the provided API URL is valid
      const urlPattern = /^https?:\/\/[^\s]+$/;
      if (!urlPattern.test(apiUrl)) {
        return api.sendMessage("Please provide a valid API URL.", event.threadID, event.messageID);
      }

      // Make the HTTP GET request to the provided API URL with the query
      const response = await axios.get(`${apiUrl}?text=${encodeURIComponent(query)}`);

      // Output the response data
      const apiResponse = response.data;
      api.sendMessage(`API Response:\n\n${JSON.stringify(apiResponse, null, 2)}`, event.threadID, event.messageID);
      
    } catch (error) {
      console.error('Error evaluating API:', error.message);
      api.sendMessage(`Failed to evaluate the API. Error: ${error.message}`, event.threadID, event.messageID);
    }
  }
};

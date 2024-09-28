const fs = require('fs');

module.exports = {
  config: {
    name: "gcode",
    version: "1.0",
    author: "Denver~Morgan",
    countDown: 15,
    role: 2, // Restrict access to role 2 or higher
    shortDescription: "Read and display file content",
    longDescription: "Reads the content of a file from the bot's directory and displays it.",
    category: "owner",
    guide: "{p}{n} <filename>"
  },
  onStart: async function ({ args, event, api }) {
    try {
      const fileName = args.join(" ");
      if (!fileName) {
        return api.sendMessage("Please specify a file name to read.", event.threadID, event.messageID);
      }

      // Construct the full path to the file
      const filePath = __dirname + "/" + fileName;

      // Check if the file exists
      if (!fs.existsSync(filePath)) {
        return api.sendMessage(`The file "${fileName}" does not exist.`, event.threadID, event.messageID);
      }

      // Read the file content
      const fileContent = fs.readFileSync(filePath, "utf8");

      // Send the file content as a message
      api.sendMessage(`Content of "${fileName}":\n\n${fileContent}`, event.threadID, event.messageID);
    } catch (error) {
      console.error('Error reading file:', error.message);
      api.sendMessage(`Failed to read the file. Error: ${error.message}`, event.threadID, event.messageID);
    }
  }
};
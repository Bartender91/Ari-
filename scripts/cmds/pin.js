// Required modules for HTTP requests, file system operations, and path manipulation
const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
    config: {
        name: "pin", // Command name
        aliases: ["pinterest"], // Alternative names for the command
        version: "1.0.0", // Version of the command
        author: "kshitiz", // Author of the command
        role: 0, // Role required to use the command
        countDown: 10, // Cooldown time before the command can be used again
        shortDescription: {
            en: "Search images on Pinterest" // Short description of the command
        },
        category: "image", // Command category
        guide: {
            en: "{prefix}pin <search query> -<number of images>" // Usage guide for the command
        }
    },

    // Main function to handle the command execution
    onStart: async function ({ api, event, args, usersData }) {

        try {
            // Join the arguments to form the search query string
            const searchQuery = args.join(" ");

            // Check if the search query includes the expected "-" separator
            if (!searchQuery.includes("-")) {
                return api.sendMessage(
                    `Invalid format. Example: {prefix}pin cats -5`,
                    event.threadID,
                    event.messageID
                );
            }

            // Split the search query into the actual search term and the number of images
            const [query, numImages] = searchQuery
                .split("-")
                .map(str => str.trim());

            // Convert the number of images to a number and validate it
            const numberOfImages = parseInt(numImages);
            if (isNaN(numberOfImages) || numberOfImages <= 0 || numberOfImages > 25) {
                return api.sendMessage(
                    "Please specify a number between 1 and 25.",
                    event.threadID,
                    event.messageID
                );
            }

            // Pinterest API URL with the search query
            const apiUrl = `https://pin-kshitiz.vercel.app/pin?search=${encodeURIComponent(query)}`;

            // Send the HTTP request to the API and wait for the response
            const response = await axios.get(apiUrl);

            // Extract the image data from the API response
            const imageData = response.data.result;

            // Check if valid images were returned by the API
            if (!imageData || !Array.isArray(imageData) || imageData.length === 0) {
                return api.sendMessage(
                    `No images found for "${query}".`,
                    event.threadID,
                    event.messageID
                );
            }

            // Array to store image data (file streams) for sending as attachments
            const imgData = [];

            // Loop through the images, but limit it to the number of requested images or available ones
            for (let i = 0; i < Math.min(numberOfImages, imageData.length); i++) {
                const imageUrl = imageData[i]; // Get the image URL

                try {
                    // Download the image data as a binary buffer
                    const imgResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });

                    // Define the local path to save the image temporarily
                    const imgPath = path.join(__dirname, 'cache', `${i + 1}.jpg`);

                    // Save the image buffer to the defined path
                    await fs.outputFile(imgPath, imgResponse.data);

                    // Push the image as a file stream to the array for sending
                    imgData.push(fs.createReadStream(imgPath));

                } catch (error) {
                    // Log any errors while fetching the image
                    console.error(error);
                }
            }

            // Send the images as attachments in a message
            await api.sendMessage(
                { attachment: imgData, body: `${numberOfImages} images for "${query}"` },
                event.threadID,
                event.messageID
            );

        } catch (error) {
            // Log the error if something goes wrong
            console.error(error);

            // Inform the user that an error occurred
            return api.sendMessage(
                `An error occurred.`,
                event.threadID,
                event.messageID
            );
        }
    }
};

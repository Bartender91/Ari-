const axios = require('axios');

module.exports = {
    config: {
        name: "glen",
        aliases: ["lens"],
        version: "1.0",
        author: "Samir Œ",
        countDown: 5,
        role: 0,
        description: {
            vi: "Tìm kiếm hình ảnh và hiển thị kết quả từ URL",
            en: "Search for images and display results from source URL"
        },
        category: "𝗨𝗧𝗜𝗟𝗜𝗧𝗬",
    },
    onStart: async function ({ api, args, message, event }) {
        let imageUrl;

        if (event.messageReply && event.messageReply.attachments.length > 0) {
            imageUrl = event.messageReply.attachments[0].url;
        } else if (args.length > 0) {
            imageUrl = args[0];
        } else {
            return message.reply({ body: "Please reply to an image or provide an image URL." });
        }

        try {
            const response = await axios.get(`${global.api.samirApi}/glens?url=${encodeURIComponent(imageUrl)}`);
            const results = response.data.slice(0, 6);

            if (results.length > 0) {
                const trackInfo = results.map((result, index) => 
                    `${index + 1}. ${result.title}\nURL: ${result.link}\n`
                ).join("\n\n");

                const thumbnails = results.map(result => result.thumbnail);
                const attachments = await Promise.all(
                    thumbnails.map(thumbnail => 
                        global.utils.getStreamFromURL(thumbnail)
                    )
                );

                await message.reply({
                    body: `${trackInfo}`,
                    attachment: attachments
                });
            } else {
                message.reply({ body: "No results found for the given image." });
            }
        } catch (error) {
            console.error(error);
            message.reply({ body: "An error occurred while fetching image search results." });
        }
    }
};
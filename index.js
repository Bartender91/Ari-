/**
 * @author NTKhang
 * ! The source code is written by NTKhang, please don't change the author's name everywhere. Thank you for using
 * ! Official source code: https://github.com/ntkhang03/Goat-Bot-V2
 */

const { spawn } = require("child_process");
const log = require("./logger/log.js");
const express = require("express");

function startProject() {
    const child = spawn("node", ["Goat.js"], {
        cwd: __dirname,
        stdio: "inherit",
        shell: true
    });

    child.on("close", (code) => {
        if (code == 2) {
            log.info("Restarting Project...");
            startProject();
        }
    });
}

// Start the bot process
startProject();

// Set up a web server using Express
const app = express();
const port = process.env.PORT || 3000;  // Use port from environment or default to 3000

// Simple route to display that the bot is running
app.get('/', (req, res) => {
    res.send('Bot is running successfully!');
});

// Listen on the specified port
app.listen(port, '0.0.0.0', () => {
    console.log(`Web server running at http://localhost:${port}`);
});
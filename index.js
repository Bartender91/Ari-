const express = require('express');
const { spawn } = require("child_process");
const log = require("./logger/log.js");

const app = express();
const port = process.env.PORT || 8000;  // Use environment variable or default to 8000

// Serve a simple webpage
app.get('/', (req, res) => {
  res.send('Bot is running!');
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Web server running at http://localhost:${port}`);
});

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

startProject();
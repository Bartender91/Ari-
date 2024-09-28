const fs = require('fs-extra');

module.exports = {
  config: {
    name: 'restart',
    version: '2.0',
    author: 'Morgan',
    countDown: 5,
    role: 2,
    shortDescription: {
      vi: 'Khởi động lại bot',
      en: 'Restart bot',
    },
    longDescription: {
      vi: 'Khởi động lại bot',
      en: 'Restart bot',
    },
    category: 'owner',
    guide: {
      vi: '{pn}:Khởi động lại',
      en: '{pn} Restart',
    },
  },
  langs: {
    vi: {
      restartting: ' 🔌|Khởi động lại bot...',
    },
    en: {
      restartting: ' 🔌|Restarting bot...',
    },
  },

  onload: function ({ api }) {
    const pathFile = `${__dirname}/tmp/restart.txt`;
    if (fs.existsSync(pathFile)) {
      const [tid, time] = fs.readFileSync(pathFile, 'utf-8').split(' ');
      api.sendMessage(` |Bot restarted\ime: ${(Date.now() - time) / 1000}s`, tid);
      fs.unlinkSync(pathFile);
    }
  },

  onStart: async function ({ message, event, getLang }) {
    const pathFile = `${__dirname}/tmp/restart.txt`;
    fs.writeFileSync(pathFile, `${event.threadID} ${Date.now()}`);
    await message.reply(getLang('restartting'));
    process.exit(2);
  },
};
module.exports = {
  config: {
    name: "offbot",
    version: "1.0",
    author: "Morgan",
    countDown: 45,
    role: 2,
    shortDescription: "Turn off bot",
    longDescription: "Turn off bot",
    category: "owner",
    guide: "{p}{n}"
  },
  onStart: async function ({event, api}) {
    api.sendMessage("Bot going night-night... don't worry, I'll be back to annoy you with helpful responses soon",event.threadID, () =>process.exit(0))}
};
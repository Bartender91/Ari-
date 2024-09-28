const axios = require("axios");

module.exports = {
  config: {
    name: "compile",
    version: "1.0",
    author: "🚬",
    role: 0,
    shortDescription: "Compile code in various programming languages",
    longDescription: "Compile and run code in various programming languages such as JavaScript, Python, C, C++, Ruby, C#, PHP, and more",
    category: "utility",
    guide: {
      en: "{pn} <language> ^^ <code>"
    },
  },

  onStart: async function ({ api, event, args, message }) {
    const input = args.join(" ").split(" ^^ ");
    const language = input[0].toLowerCase();
    const code = input[1];

    const supportedLanguages = ["python", "nodejs", "c", "cpp", "ruby", "csharp", "fsharp", "java", "erlang", "php", "swift", "go", "rust", "typescript", "r", "bash", "perl", "scala", "kotlin", "lua", "haskell", "dart", "groovy", "powershell", "elixir", "coffeescript", "assembly", "matlab", "objective-c", "sql", "fortran", "cobol", "scheme", "clojure", "racket", "prolog", "lisp", "smalltalk", "perl6", "vbscript", "apl", "julia", "ocaml", "rpg"];

    if (!supportedLanguages.includes(language) || !code) {
      message.reply(`Invalid language. Supported languages are: ${supportedLanguages.join(", ")}. \n\nExample:\n${event.body.split(" ")[0]} cpp ^^ #include <iostream> using namespace std; int main() { cout << "Hello, world!" << endl; return 0; }`);
      return;
    }

    const wait = await message.reply("⏳ Loading...");
    try {
      const startTime = new Date();
      const response = await axios.post("https://api.jdoodle.com/v1/execute", {
        script: code,
        language: language === "cpp" ? "cpp14" : language === "python" ? "python3" : language,
        versionIndex: "0",
        clientId: "3a20bbfa72b79d29d3ca81812a2ee18b",
        clientSecret: "1121d25dc7998715c500218d3abeae8edab573fe7ef2c1577fe0768802d92d68"
      });

      const result = response.data;
      const endTime = new Date();
      const executionTime = (endTime - startTime);

      if (result.error) {
        message.reaction("❌", wait.messageID);
        api.editMessage(`❌ Error:\n${result.error}`, wait.messageID);
      } else {
        message.reaction("✅", wait.messageID);
        api.editMessage(`✅ Program Output:\n${result.output}\n\n⏱️ Time: ${executionTime / 1000}s`, wait.messageID);
      }
    } catch (error) {
      console.error("Error compiling code:", error);
      message.reaction("❗", wait.messageID);
      api.editMessage(error.code, wait.messageID);
    }
  },
};
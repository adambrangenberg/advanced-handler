const { readdirSync } = require("fs");
const ascii = require("ascii-table");

let table = new ascii("Commands");
table.setHeading("📄  • Command", "🔁  • Load Status");

console.log("Welcome to the Fileloader!");

module.exports = (client) => {
  readdirSync("./commands/").forEach(async (dir) => {
    const commands = readdirSync(`./commands/${dir}/`).filter((file) =>
      file.endsWith(".js")
    );
    for (let file of commands) {
      try {
        let pull = require(`../commands/${dir}/${file}`);
        if (pull.name) {
          client.commands.set(pull.name, pull);
          table.addRow(file, "✅  • Ready");

          const data = {
            name: pull.name,
            description: pull.description,
            options: pull.options,
          };

          if (pull.test) {
            client.guilds.cache.get(client.IDs.testguild)?.commands.set([data,]);
          } else {
            client.application.commands.set([data,]);
          }
        }

        if (!pull.name) {
          table.addRow(file, "❌  • help.name is missing");
          continue;
        }
      } catch (error) {
        console.log(error)
      }
    }
  });

  console.log(table.toString());
};

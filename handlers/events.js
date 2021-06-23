const { readdir, readdirSync } = require("fs");
const ascii = require("ascii-table");

let table = new ascii("Events");
table.setHeading("📄  • Events", "🔁  • Load Status");

module.exports = async (client) => {
  let theevents;
  readdirSync("./events").forEach((file) => {
    theevents = readdirSync("./events/").filter((file) => file.endsWith(".js"));
    readdir("./events", (err, files) => {
      if (err) return console.error(err);
      const event = require(`../events/${file}`);
      let eventName = file.split(".")[0];
      theevents = eventName;
      client.on(eventName, event.bind(null, client));
    });
  });

  for (let i = 0; i < theevents.length; i++) {
    try {
      table.addRow(theevents[i], "✅  • Ready");
    } catch (error) {
      console.error(error);
    }
  }

  console.log(table.toString());
};

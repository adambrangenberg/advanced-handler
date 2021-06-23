//Just an example, this event is because of the handlerstructure useless
module.exports = async (client) => {
  console.log(`${client.user.tag} is on discord online!`); 

  client.user.setPresence({
    status: "dnd", // online | idle | dnd | invisible 
    activity: {
      name: `a few guilds.`, 
      type: "WATCHING", // PLAYING | WATCHING | LISTENING | STREAMING, if streaming add under type a url. it must be a twitch url or it wont work
    },
  });
}
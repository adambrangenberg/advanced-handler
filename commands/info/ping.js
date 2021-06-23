module.exports = {
  name: "ping", 
  description: "Shows you the current botlatency", 
  slash: true,

  run: async (client, interaction) => {
    const replyembed = client.embed
      .setColor(client.color.success)
      .setTitle(':ping_pong: Pong!')
      .addFields(
        {
          "name": 'API Ping',
          "value": `\`${client.ws.ping}ms\``,
          "inline": true
        },
        {
          "name": 'Bot Ping',
          "value": `\`${Date.now() - interaction.createdTimestamp}ms\``,
          "inline": true
        }
      )
      .setTimestamp()
      .setFooter(`${client.user.username} by ${client.owner.tag}`, client.user.avatarURL);

    await interaction.reply({ embeds: [replyembed] });
  },
}
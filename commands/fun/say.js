module.exports = {
    name: "say",  
    description: "Repeats the input", 
    options: [{
        name: 'input',
        type: 'STRING',
        description: 'The text that would be repeated',
        required: true,
    }],
    slash: true,

    run: async (client, interaction) => {
        const replyembed = client.embed
            .setColor(client.color.success)
            .addField(interaction.user.username, interaction.options.get('input').value)
            .setTimestamp()
            .setFooter(`${client.user.username} by ${client.owner.tag}`, client.user.avatarURL);

        await interaction.reply({ embeds: [replyembed] });
    },
}
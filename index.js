const config = require("./config.json");

const fs = require("fs");
const { Client, Collection, Intents, Permissions, MessageEmbed } = require("discord.js");
require("dotenv").config();

const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
    allowedMentions: {
        parse: ['users', 'roles'], repliedUser: true
    },
    partials: ["MESSAGE", "CHANNEL", "REACTION"],
});

client.color = config.color;
client.owner = config.owner;
client.IDs = config.IDs;

client.embed = new MessageEmbed()
client.commands = new Collection();
const cooldowns = new Collection();
client.categories = fs.readdirSync("./commands/");

client.on('ready', () => {
    const commandhandler = require('./handlers/command');
    commandhandler(client);

    const eventhandler = require("./handlers/events");
    eventhandler(client);

    console.log(`${client.user.tag} is on discord online!`);

    client.user.setPresence({
        status: "dnd", // online | idle | dnd | invisible 
        activity: {
            name: `${client.user.username} • ${config.prefix}help`, 
            type: "WATCHING", // PLAYING | WATCHING | LISTENING | STREAMING, if streaming add under type a url. it must be a twitch url or it wont work
        },
    });
})


client.on('interaction', async interaction => {
    if (interaction.isCommand()) {
        const command = client.commands.get(interaction.commandName);
        console.log(command);
        if (command) {
            console.log(interaction)
            if (!command.slash) return interaction.reply({
                content: "This command isn't a valid slashcommand!",
                ephemeral: true,
            });

            if (command.dev) {
                if (interaction.user.id !== client.owner.id)
                    return interaction.reply({
                        content: "This command is currently in developement",
                        ephemeral: true,
                    });
            }

            if (command.friendsonly) {
                if (!client.IDs.friendsonly.includes(interaction.guild.id))
                    return interaction.reply({
                        content: "This command isn't aviable here!",
                        ephemeral: true,
                    });
            }

            if (command.clientPermissions) {
                if (!command.clientPermissions.length > 0) return;

                let clientChannelPermissions = interaction.channel.permissionsFor(
                    interaction.guild.me
                );

                clientChannelPermissions = new Permissions(
                    clientChannelPermissions.bitfield
                );
                if (!clientChannelPermissions.has(command.clientPermissions)) {
                    const missingPermissions = command.clientPermissions
                        .filter((perm) => clientChannelPermissions.has(perm) === false)
                        .join(", ");
                    return interaction.reply({
                        content: `I'm missing these permissions: ${missingPermissions}\`!`,
                        ephemeral: true,
                    });
                }
            }

            if (command.userPermissions) {
                if (!command.userPermissions.length > 0) return;

                let userChannelPermissions = interaction.channel.permissionsFor(
                    interaction.member
                );

                userChannelPermissions = new Permissions(
                    memberChannelPermissions.bitfield
                );
                if (!userChannelPermissions.has(command.clientPermissions)) {
                    const missingPermissions = command.memberPermissions
                        .filter((perm) => clientChannelPermissions.has(perm) === false)
                        .join(", ");
                    return interaction.reply({
                        content: `You're missing these permissions: ${missingPermissions}\`!`,
                        ephemeral: true,
                    });
                }
            }

            if (!cooldowns.has(command.name)) {
                cooldowns.set(command.name, new Collection());
            }

            const now = Date.now();
            const timestamps = cooldowns.get(command.name);
            const cooldownAmount = (command.cooldown || 1) * 1000;

            if (timestamps.has(interaction.member.id)) {
                const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

                if (now < expirationTime) {
                    const timeLeft = (expirationTime - now) / 1000;
                    return interaction.reply({
                        content: `Wait \`${timeLeft.toFixed(1)}\`seconds until use **${command.name}** again!`,
                        ephemeral: true,
                    });
                }
            }

            timestamps.set(interaction.user.id, now);
            setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

            try {
                command.run(client, interaction);
            } catch (error) {
                console.error(error);
            }
        } // command
    }
});

console.log("Logging in...");
client.login(process.env.TOKEN);
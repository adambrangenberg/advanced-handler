module.exports = {
    name: "name",
    description: "commanddescription",
    options: [{
        name: 'optionname',
        type: 'optiontype',
        description: 'optiondescription',
        required: true, //If option is required
    }],
    slash: true, //activate/deactivate command
    dev: true, // only aviable for botowner
    friendsonly: true, // only aviable on specific guilds
    clientPermissions: ["SOME_PERMISSION_CLIENT_NEEDS"],
    userPermissions: ["SOME_PERMISSIONS_USER_NEEDS"],
    cooldown: 1, // the commandcooldown

    run: async (client, interaction) => {
        // You're code
    },
}
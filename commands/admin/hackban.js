const { MessageEmbed } = require("discord.js");

module.exports = {
    name: 'hackban',
    aliases: ['fuckban', 'fuck', 'fban'],
    punitop: false,
    adminPermit: false,
    ownerPermit: false,
    cat: 'admin',
    run: async (client, message, args, prefix) => {
        // Check if the user has the 'BAN_MEMBERS' permission
        if (!message.member.permissions.has('BAN_MEMBERS')) {
            return message.channel.send({
                embeds: [new MessageEmbed().setColor(`#2f3136`).setDescription(`${client.emoji.cross} | You don't have permission to **Ban** users.`)]
            }).catch(() => null);
        }

        // Check if the bot has the 'BAN_MEMBERS' permission
        if (!message.guild.me.permissions.has('BAN_MEMBERS')) {
            return message.channel.send({
                embeds: [new MessageEmbed().setColor(`#2f3136`).setDescription(`${client.emoji.cross} | I don't have permission to **Hackban** users.`)]
            }).catch(() => null);
        }

        // Validate user input
        if (!args[0]) {
            return message.channel.send({
                embeds: [new MessageEmbed().setColor(`#2f3136`).setDescription(`${client.emoji.cross} | Command Usage: \`${prefix}hackban <userID> [reason]\``)]
            }).catch(() => null);
        }

        let user = args[0];  // We expect user ID input for hackban
        let reason = args.slice(1).join(' ') || 'No reason given';

        // Ensure user ID is valid
        if (isNaN(user)) {
            return message.channel.send({
                embeds: [new MessageEmbed().setColor(`#2f3136`).setDescription(`${client.emoji.cross} | Please provide a valid **user ID**.`)]
            }).catch(() => null);
        }

        // Check if the user is the server owner
        if (user === message.guild.ownerId) {
            return message.channel.send({
                embeds: [new MessageEmbed().setColor(`#2f3136`).setDescription(`${client.emoji.cross} | You cannot hackban the **Server Owner**.`)]
            }).catch(() => null);
        }

        // Check if the user is the bot's owner
        if (client.config.owner.includes(user)) {
            return message.channel.send({
                embeds: [new MessageEmbed().setColor(`#2f3136`).setDescription(`${client.emoji.cross} | I cannot hackban my **Owner**.`)]
            }).catch(() => null);
        }

        // Prevent self-hackban
        if (user === message.member.id) {
            return message.channel.send({
                embeds: [new MessageEmbed().setColor(`#2f3136`).setDescription(`${client.emoji.cross} | You cannot hackban **Yourself**.`)]
            }).catch(() => null);
        }

        // Ban the user by their ID
        try {
            await message.guild.members.ban(user, { reason: `${message.author.tag} | ${reason}` });
            return message.channel.send({
                embeds: [new MessageEmbed().setColor(`#2f3136`).setDescription(`${client.emoji.tick} | Successfully **Hacked** and **Banned** <@${user}> executed by: ${message.author.tag}\n${client.emoji.arrow} Reason: ${reason}`)]
            }).catch(() => null);
        } catch (err) {
            return message.channel.send({
                embeds: [new MessageEmbed().setColor(`#2f3136`).setDescription(`${client.emoji.cross} | There was an error trying to **Hackban** the user. Please check if the ID is valid or if I have the proper permissions.`)]
            }).catch(() => null);
        }
    }
};
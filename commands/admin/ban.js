const { MessageEmbed } = require("discord.js");

module.exports = {
    name: 'ban',
    aliases: ['b'],
    ownerPermit: false,
    adminPermit: false,
    punitop: false,
    cat: 'admin',
    run: async (client, message, args, prefix) => {
        // Prevent multiple execution by using a simple flag
        if (message.handled) return;  // Prevent further execution if already handled
        message.handled = true;  // Mark as handled to avoid reprocessing

        // Check if the user has the required 'BAN_MEMBERS' permission
        if (!message.member.permissions.has('BAN_MEMBERS')) {
            return message.channel.send({
                embeds: [new MessageEmbed().setColor(`#2f3136`).setDescription(`${client.emoji.cross} | You don't have permission to **Ban** users.`)]
            }).catch(() => null);
        }

        // Check if the bot has the required 'BAN_MEMBERS' permission
        if (!message.guild.me.permissions.has('BAN_MEMBERS')) {
            return message.channel.send({
                embeds: [new MessageEmbed().setColor(`#2f3136`).setDescription(`${client.emoji.cross} | I don't have permission to **Ban** users.`)]
            }).catch(() => null);
        }

        // Check if a user is mentioned
        if (!args[0]) {
            return message.channel.send({
                embeds: [new MessageEmbed().setColor(`#2f3136`).setDescription(`${client.emoji.cross} | Command Usage: \`${prefix}ban <user> [reason]\``)]
            }).catch(() => null);
        }

        let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!user) {
            return message.channel.send({
                embeds: [new MessageEmbed().setColor(`#2f3136`).setDescription(`${client.emoji.cross} | Please provide a valid user.`)]
            }).catch(() => null);
        }

        let reason = args.slice(1).join(' ') || 'No reason given';

        // Prevent banning the server owner
        if (user.id === message.guild.ownerId) {
            return message.channel.send({
                embeds: [new MessageEmbed().setColor(`#2f3136`).setDescription(`${client.emoji.cross} | You can't **Ban** the Server Owner.`)]
            }).catch(() => null);
        }

        // Prevent banning the bot's owner
        if (client.config.owner.includes(user.id)) {
            return message.channel.send({
                embeds: [new MessageEmbed().setColor(`#2f3136`).setDescription(`${client.emoji.cross} | I can't **Ban** my owner.`)]
            }).catch(() => null);
        }

        // Prevent self-ban
        if (user.id === message.member.id) {
            return message.channel.send({
                embeds: [new MessageEmbed().setColor(`#2f3136`).setDescription(`${client.emoji.cross} | You cannot **Ban** yourself.`)]
            }).catch(() => null);
        }

        // Check if the user is bannable
        if (!user.bannable) {
            return message.channel.send({
                embeds: [new MessageEmbed().setColor(`#2f3136`).setDescription(`${client.emoji.cross} | I can't **Ban** that user. Please check my role position and permissions.`)]
            }).catch(() => null);
        }

        // Attempt to ban the user
        try {
            await message.guild.members.ban(user.id, { reason: `${message.author.tag} | ${reason}` });
            return message.channel.send({
                embeds: [new MessageEmbed().setColor(`#2f3136`).setDescription(`${client.emoji.tick} | Successfully **Banned** ${user.user.tag} by ${message.author.tag}\n${client.emoji.arrow} Reason: ${reason}`)]
            }).catch(() => null);
        } catch (err) {
            return message.channel.send({
                embeds: [new MessageEmbed().setColor(`#2f3136`).setDescription(`${client.emoji.cross} | There was an error while trying to **Ban** that user.`)]
            }).catch(() => null);
        }
    }
};
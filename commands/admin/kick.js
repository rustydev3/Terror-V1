const { MessageEmbed } = require("discord.js");

module.exports = {
    name: 'kick',
    aliases: ['k'],
    adminPermit: false,
    ownerPermit: false,
    punitop: false,
    cat: 'admin',
    run: async (client, message, args, prefix) => {
        // Check if the user has the required 'KICK_MEMBERS' permission
        if (!message.member.permissions.has('KICK_MEMBERS')) {
            return message.channel.send({
                embeds: [new MessageEmbed().setColor(`#2f3136`).setDescription(`${client.emoji.cross} | You don't have permission to **Kick** members.`)]
            });
        }

        // Check if the bot has the required 'KICK_MEMBERS' permission
        if (!message.guild.me.permissions.has('KICK_MEMBERS')) {
            return message.channel.send({
                embeds: [new MessageEmbed().setColor(`#2f3136`).setDescription(`${client.emoji.cross} | I don't have permission to **Kick** members.`)]
            });
        }

        // Check if a user is mentioned or provided
        if (!args[0]) {
            return message.channel.send({
                embeds: [new MessageEmbed().setColor(`#2f3136`).setDescription(`${client.emoji.cross} | Command Usage: \`${prefix}kick <user> [reason]\``)]
            });
        }

        let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!user) {
            return message.channel.send({
                embeds: [new MessageEmbed().setColor(`#2f3136`).setDescription(`${client.emoji.cross} | Please provide a valid user.`)]
            });
        }

        // Check if the user is attempting to kick the server owner or bot owner
        if (user.id === message.guild.ownerId) {
            return message.channel.send({
                embeds: [new MessageEmbed().setColor(`#2f3136`).setDescription(`${client.emoji.cross} | You can't **Kick** the Server Owner.`)]
            });
        }

        if (client.config.owner.includes(user.id)) {
            return message.channel.send({
                embeds: [new MessageEmbed().setColor(`#2f3136`).setDescription(`${client.emoji.cross} | I can't **Kick** my owner.`)]
            });
        }

        // Check if the user is attempting to kick themselves
        if (user.id === message.member.id) {
            return message.channel.send({
                embeds: [new MessageEmbed().setColor(`#2f3136`).setDescription(`${client.emoji.cross} | You can't **Kick** yourself.`)]
            });
        }

        // Check if the user is kickable
        if (!user.kickable) {
            return message.channel.send({
                embeds: [new MessageEmbed().setColor(`#2f3136`).setDescription(`${client.emoji.cross} | I can't **Kick** that user. Please check my role position and permissions.`)]
            });
        }

        let reason = args.slice(1).join(' ') || 'No reason given';

        // Attempt to kick the user
        try {
            await user.kick({ reason: `${message.author.tag} | ${reason}` });
            return message.channel.send({
                embeds: [new MessageEmbed().setColor(`#2f3136`).setDescription(`${client.emoji.tick} | Successfully **Kicked** ${user.user.tag} by ${message.author.tag}\n${client.emoji.arrow} Reason: ${reason}`)]
            });
        } catch (err) {
            return message.channel.send({
                embeds: [new MessageEmbed().setColor(`#2f3136`).setDescription(`${client.emoji.cross} | I can't **Kick** that user. Check my role position and permissions.`)]
            });
        }
    }
};
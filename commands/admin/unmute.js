const { Permissions, MessageEmbed } = require("discord.js");

module.exports = {
    name: `unmute`,
    aliases: [`um`],
    punitop: false,
    adminPermit: true,
    ownerPermit: false,
    cat: 'admin',
    run: async (client, message, args, prefix) => {
        // Check if the user has the MANAGE_MESSAGES and TIMEOUT_MEMBERS permission
        if (!message.member.permissions.has(Permissions.FLAGS.TIMEOUT_MEMBERS) || !message.member.permissions.has(Permissions.FLAGS.TIMEOUT_MEMBERS)) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(`#2f3136`)
                        .setDescription(`${client.emoji.cross} | You need \`MANAGE_MESSAGES\` and \`TIMEOUT_MEMBERS\` permissions to use this command.`)
                ]
            });
        }

        // Check if a user was mentioned or provided
        if (!args[0]) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(`#2f3136`)
                        .setDescription(`${client.emoji.cross} | Command Usage: \`${prefix}unmute <user> [reason]\``)
                ]
            });
        }

        // Find the user to unmute
        let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!user) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(`#2f3136`)
                        .setDescription(`${client.emoji.cross} | Please provide a valid user.`)
                ]
            });
        }

        // Set the reason for the unmute
        let reason = args.slice(1).join(' ');
        if (!reason) reason = 'No Reason given';

        // Handle special cases
        if (user.id === client.user.id) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(`#2f3136`)
                        .setDescription(`${client.emoji.cross} | I cannot unmute myself.`)
                ]
            });
        }
        if (user.id === message.guild.ownerId) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(`#2f3136`)
                        .setDescription(`${client.emoji.cross} | You cannot unmute the server owner.`)
                ]
            });
        }
        if (!user.isCommunicationDisabled()) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(`#2f3136`)
                        .setDescription(`${client.emoji.cross} | The user is not muted.`)
                ]
            });
        }

        // Check if the bot has the MANAGE_MESSAGES permission
        if (!message.guild.me.permissions.has(Permissions.FLAGS.TIMEOUT_MEMBERS)) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(`#2f3136`)
                        .setDescription(`${client.emoji.cross} | I don't have the \`TIMEOUT_MEMBERS\` permission to unmute users.`)
                ]
            });
        }

        // Unmute the user
        try {
            await user.timeout(0, `${message.author.tag} | ${reason}`);
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(`#2f3136`)
                        .setDescription(`${client.emoji.tick} | Successfully **Unmuted** ${user.user.tag} executed by: ${message.author.tag}\n${client.emoji.arrow} Reason: ${reason}`)
                ]
            });
        } catch (error) {
            console.error(`Failed to unmute user ${user.user.tag}:`, error);
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(`#2f3136`)
                        .setDescription(`${client.emoji.cross} | Failed to unmute the user. Please check my permissions.`)
                ]
            });
        }
    }
};
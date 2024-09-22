const { MessageEmbed, Permissions } = require("discord.js");
const ms = require('ms');

module.exports = {
    name: 'mute',
    aliases: ['timeout', 'stfu', 'm', 'to'],
    adminPermit: false,  // Set adminPermit to false
    ownerPermit: false,
    cat: 'admin',
    punitop: false,
    run: async (client, message, args, prefix) => {
        if (!message.member.permissions.has(Permissions.FLAGS.MODERATE_MEMBERS)) {
            return message.channel.send({
                embeds: [new MessageEmbed().setColor('#2f3136').setDescription(`${client.emoji.cross} | You don't have permission to **Mute** members.`)]
            });
        }

        if (!message.guild.me.permissions.has(Permissions.FLAGS.MODERATE_MEMBERS)) {
            return message.channel.send({
                embeds: [new MessageEmbed().setColor('#2f3136').setDescription(`${client.emoji.cross} | I don't have permission to **Mute** members. Please check my permissions.`)]
            });
        }

        if (!args[0]) {
            return message.channel.send({
                embeds: [new MessageEmbed().setColor('#2f3136').setDescription(`${client.emoji.cross} | Command Usage: \`${prefix}mute <user> <time> [reason]\``)]
            });
        }

        let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!user) {
            return message.channel.send({
                embeds: [new MessageEmbed().setColor('#2f3136').setDescription(`${client.emoji.cross} | Please provide a valid user.`)]
            });
        }

        let time = args[1];
        if (!time) time = '7days';
        let dur = ms(time);

        if (!dur) {
            return message.channel.send({
                embeds: [new MessageEmbed().setColor('#2f3136').setDescription(`${client.emoji.cross} | Please provide a valid time.`)]
            });
        }

        if (user.isCommunicationDisabled()) {
            return message.channel.send({
                embeds: [new MessageEmbed().setColor('#2f3136').setDescription(`${client.emoji.cross} | That user is already muted.`)]
            });
        }

        if (user.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
            return message.channel.send({
                embeds: [new MessageEmbed().setColor('#2f3136').setDescription(`${client.emoji.cross} | I can't mute admins.`)]
            });
        }

        if (user.id === message.guild.ownerId) {
            return message.channel.send({
                embeds: [new MessageEmbed().setColor('#2f3136').setDescription(`${client.emoji.cross} | You can't mute the Server Owner.`)]
            });
        }

        if (client.config.owner.includes(user.id)) {
            return message.channel.send({
                embeds: [new MessageEmbed().setColor('#2f3136').setDescription(`${client.emoji.cross} | I can't mute my owner.`)]
            });
        }

        if (user.id === message.member.id) {
            return message.channel.send({
                embeds: [new MessageEmbed().setColor('#2f3136').setDescription(`${client.emoji.cross} | You cannot mute yourself.`)]
            });
        }

        if (!user.manageable) {
            return message.channel.send({
                embeds: [new MessageEmbed().setColor('#2f3136').setDescription(`${client.emoji.cross} | I can't mute that user. Please check my role position and permissions.`)]
            });
        }

        let reason = args.slice(2).join(' ') || 'No reason given';

        await user.timeout(dur, `${message.author.tag} | ${reason}`).catch(err => {
            return message.channel.send({
                embeds: [new MessageEmbed().setColor('#2f3136').setDescription(`${client.emoji.cross} | There was an error muting that user.`)]
            });
        });

        return message.channel.send({
            embeds: [new MessageEmbed().setColor('#2f3136').setDescription(`${client.emoji.tick} | Successfully muted ${user.user.tag} for ${time}. \n${client.emoji.arrow} Reason: ${reason}`)]
        });
    }
};
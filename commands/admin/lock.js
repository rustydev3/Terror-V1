const { MessageEmbed } = require("discord.js");

module.exports = {
    name: 'lock',
    aliases: ['lockchannel', 'lock-channel', 'lockch'],
    punitop: false,
    adminPermit: false, // Set adminPermit to false
    ownerPermit: false,
    cat: 'admin',
    run: async (client, message, args, prefix) => {
        if (!message.member.permissions.has('MANAGE_CHANNELS')) {
            return message.channel.send({
                embeds: [new MessageEmbed().setColor(`#2f3136`).setDescription(`${client.emoji.cross} | You don't have permission to **Lock** channels.`)]
            });
        }

        if (!message.guild.me.permissions.has('MANAGE_CHANNELS')) {
            return message.channel.send({
                embeds: [new MessageEmbed().setColor(`#2f3136`).setDescription(`${client.emoji.cross} | I don't have permission to **Lock** channels.`)]
            });
        }

        let ch = message.guild.channels.cache.get(args[0]) || message.channel || message.mentions.channels.first();
        let ro = message.guild.id;

        try {
            await ch.permissionOverwrites.edit(message.guild.id, { SEND_MESSAGES: false });
            return message.channel.send({
                embeds: [new MessageEmbed().setColor(`#2f3136`).setDescription(`${client.emoji.tick} | Successfully **Locked** ${ch} for <@&${ro}>`)]
            });
        } catch (e) {
            return message.channel.send({
                embeds: [new MessageEmbed().setColor(`#2f3136`).setDescription(`${client.emoji.cross} | I am missing adequate permissions. Please check my permissions.`)]
            });
        }
    }
}
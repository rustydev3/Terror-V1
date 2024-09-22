const { MessageEmbed, Permissions } = require("discord.js");

module.exports = {
    name: `unlock`,
    aliases: ["unlockchannel", "unlockch"],
    punitop: false,
    adminPermit: true,
    ownerPermit: false,
    cat: 'admin',
    run: async (client, message, args, prefix) => {
        if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(`#2f3136`)
                        .setDescription(`${client.emoji.cross} | You need \`MANAGE_CHANNELS\` permission to use this command.`)
                ]
            });
        }

        if (!message.guild.me.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(`#2f3136`)
                        .setDescription(`${client.emoji.cross} | I don't have adequate permissions. Please check my \`MANAGE_CHANNELS\` permission.`)
                ]
            });
        }

        let ch = message.guild.channels.cache.get(args[0]) || message.channel || message.mentions.channels.first();
        let ro = message.guild.id;

        try {
            await ch.permissionOverwrites.edit(message.guild.id, { SEND_MESSAGES: true });
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(`#2f3136`)
                        .setDescription(`${client.emoji.tick} | Successfully **Unlocked** ${ch} for <@&${ro}>`)
                ]
            });
        } catch (e) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(`#2f3136`)
                        .setDescription(`${client.emoji.cross} | I am missing adequate permissions. Please check my permissions.`)
                ]
            });
        }
    }
};
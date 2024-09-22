const { MessageEmbed, Permissions } = require("discord.js");

module.exports = {
    name: `hide`,
    aliases: ["chupado"],
    adminPermit: false,
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

        let ch = message.guild.channels.cache.get(args[0]) || message.channel || message.mentions.channels.first();
        let ro = message.guild.id;

        try {
            await ch.permissionOverwrites.edit(message.guild.id, { VIEW_CHANNEL: false });
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(`#2f3136`)
                        .setDescription(`${client.emoji.tick} | Successfully **Hid** ${ch} for <@&${ro}>`)
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
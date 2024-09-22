const { MessageEmbed, Permissions } = require("discord.js");

module.exports = {
    name: `unhideall`,
    aliases: ['un', 'unall'],
    punitop: false,
    adminPermit: true,
    cat: 'admin',
    ownerPermit: false,
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

        let count = 0;
        message.guild.channels.cache.forEach(async (ch) => {
            try {
                await ch.permissionOverwrites.edit(message.guild.id, { VIEW_CHANNEL: true });
                count++;
            } catch (error) {
                console.error(`Failed to unhide channel ${ch.name}:`, error);
            }
        });

        return message.channel.send({
            embeds: [
                new MessageEmbed()
                    .setColor(`#2f3136`)
                    .setDescription(`${client.emoji.tick} | Successfully **Unhided** ${count} channels.`)
            ]
        });
    }
};
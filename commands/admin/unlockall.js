const { Permissions, MessageEmbed } = require("discord.js");

module.exports = {
    name: `unlockall`,
    aliases: [],
    punitop: false,
    adminPermit: true,
    ownerPermit: false,
    cat: 'admin',
    run: async (client, message, args, prefix) => {
        // Check if the user has the MANAGE_CHANNELS permission
        if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(`#2f3136`)
                        .setDescription(`${client.emoji.cross} | You need \`MANAGE_CHANNELS\` permission to use this command.`)
                ]
            });
        }

        // Check if the bot has the MANAGE_CHANNELS permission
        if (!message.guild.me.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(`#2f3136`)
                        .setDescription(`${client.emoji.cross} | I don't have adequate permissions. Please check my \`MANAGE_CHANNELS\` permission.`)
                ]
            });
        }

        let c = 0;
        // Iterate over all channels and unlock them
        message.guild.channels.cache.forEach(async (ch) => {
            try {
                await ch.permissionOverwrites.edit(message.guild.id, { SEND_MESSAGES: true });
                c++;
            } catch (error) {
                console.error(`Failed to unlock channel ${ch.name}:`, error);
            }
        });

        // Send confirmation message
        return message.channel.send({
            embeds: [
                new MessageEmbed()
                    .setColor(`#2f3136`)
                    .setDescription(`${client.emoji.tick} | Successfully **Unlocked** ${c} channels.`)
            ]
        });
    }
};
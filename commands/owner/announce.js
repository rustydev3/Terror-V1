const { MessageEmbed } = require('discord.js');
const config = require('../../config.json');


module.exports = {
    name: 'announ',
    aliases: [],
    punitop: false,
    adminPermit: false,
    ownerPermit: false,  // Only allow bot's owner to use this
    cat: 'owner',
    run: async (client, message, args, prefix) => {
        // Check if the message author is the bot owner
        if (message.author.id !== client.config.ownerId) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor('#2f3136')
                        .setDescription(`${client.emoji.cross} | You are not authorized to use this command.`)
                ]
            });
        }

        // Check if the announcement text is provided
        const announcement = args.join(' ');
        if (!announcement) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor('#2f3136')
                        .setDescription(`${client.emoji.cross} | Usage: \`${prefix}announce <text>\``)
                ]
            });
        }

        // Iterate through all the guilds the bot is in
        let sentCount = 0;
        client.guilds.cache.forEach(async (guild) => {
            try {
                // Try to find a default text channel in the guild
                let defaultChannel = guild.channels.cache.find(
                    ch => ch.type === 'GUILD_TEXT' && ch.permissionsFor(guild.me).has('SEND_MESSAGES')
                );
                
                if (defaultChannel) {
                    await defaultChannel.send({
                        embeds: [
                            new MessageEmbed()
                                .setColor('#2f3136')
                                .setTitle('📢 Announcement')
                                .setDescription(announcement)
                                .setFooter(`Announced by: ${message.author.tag}`, message.author.displayAvatarURL())
                        ]
                    });
                    sentCount++;
                }
            } catch (error) {
                console.error(`Failed to send announcement in guild ${guild.name}:`, error);
            }
        });

        // Confirmation message for the command user
        return message.channel.send({
            embeds: [
                new MessageEmbed()
                    .setColor('#2f3136')
                    .setDescription(`${client.emoji.tick} | Successfully sent the announcement to **${client.guilds.cache.size}** servers.`)
            ]
        });
    }
};

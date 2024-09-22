const { Permissions, MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');

module.exports = {
    name: 'nuke',
    aliases: ['clonec'],
    cat: 'util',
    punitop: false,
    ownerPermit: false,
    adminPermit: false,
    run: async (client, message, args) => {
        // Check if the user has permission to manage channels
        if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(`#2f3136`)
                        .setDescription(`${client.emoji.cross} | You don't have the required permissions to manage channels.`)
                ]
            });
        }

        // Get the target channel (either the mentioned one or the current one)
        const targetChannel = message.mentions.channels.first() || message.channel;

        // Confirmation Embed
        const confirmEmbed = new MessageEmbed()
            .setColor('#2f3136')
            .setDescription(`${client.emoji.tick} | Are you sure you want to nuke **${targetChannel.name}**? This action cannot be undone.`);

        // Create Yes and No Buttons
        const yesButton = new MessageButton()
            .setCustomId('nuke-yes')
            .setLabel('Yes')
            .setStyle('DANGER')
            .setEmoji(client.emoji.tick);

        const noButton = new MessageButton()
            .setCustomId('nuke-no')
            .setLabel('No')
            .setStyle('SECONDARY')
            .setEmoji(client.emoji.cross);

        const row = new MessageActionRow().addComponents(yesButton, noButton);

        // Send the confirmation message with buttons
        const confirmMessage = await message.channel.send({ embeds: [confirmEmbed], components: [row] });

        const filter = i => i.user.id === message.author.id;

        // Create a button collector for the confirmation
        const collector = confirmMessage.createMessageComponentCollector({ filter, time: 15000 });

        collector.on('collect', async interaction => {
            if (interaction.customId === 'nuke-yes') {
                // Nuke confirmed
                await interaction.deferUpdate();

                // Clone the channel
                const clonedChannel = await targetChannel.clone();

                // Delete the old channel
                await targetChannel.delete().catch(err => {
                    console.error(err);
                    return message.channel.send({
                        embeds: [
                            new MessageEmbed()
                                .setColor(`#2f3136`)
                                .setDescription(`${client.emoji.cross} | There was an error deleting the channel.`)
                        ]
                    });
                });

                // Send a success message
                await clonedChannel.send({
                    embeds: [
                        new MessageEmbed()
                            .setColor(`#2f3136`)
                            .setDescription(`${client.emoji.tick} | The channel has been nuked successfully.`)
                    ]
                });

                collector.stop();
            } else if (interaction.customId === 'nuke-no') {
                // Nuke cancelled
                await interaction.deferUpdate();
                await message.channel.send({
                    embeds: [
                        new MessageEmbed()
                            .setColor(`#2f3136`)
                            .setDescription(`${client.emoji.cross} | Nuke action has been canceled.`)
                    ]
                });

                collector.stop();
            }
        });

        collector.on('end', collected => {
            if (collected.size === 0) {
                message.channel.send({
                    embeds: [
                        new MessageEmbed()
                            .setColor(`#2f3136`)
                            .setDescription(`${client.emoji.cross} | Nuke action timed out.`)
                    ]
                });
            }
        });
    }
};
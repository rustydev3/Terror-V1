const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const fs = require('fs');
const path = require('path');
const ticketDbPath = path.resolve(__dirname, '../../ticketdb.json');

module.exports = {
    name: 'panelsetup',  // Command name
    description: 'Sets up a ticket panel in a specified channel.',
    usage: '?panelsetup <channel_id> <category_id>',
    userPermissions: ['MANAGE_CHANNELS'],  // Ensure the user has the required permissions

    run: async (client, message, args) => {
        // Ensure the correct number of arguments is provided
        if (args.length < 2) {
            return message.channel.send({ 
                content: 'Usage: ?panelsetup <channel_id> <category_id>' 
            });
        }

        const channelId = args[0];
        const categoryId = args[1];

        const channel = message.guild.channels.cache.get(channelId);
        const category = message.guild.channels.cache.get(categoryId);

        if (!channel || !category || category.type !== 'GUILD_CATEGORY') {
            return message.channel.send({ 
                content: 'Invalid channel or category ID provided.' 
            });
        }

        // Load or initialize the ticket category database
        let ticketDb = {};
        if (fs.existsSync(ticketDbPath)) {
            ticketDb = JSON.parse(fs.readFileSync(ticketDbPath, 'utf8'));
        }

        // Store the category ID for this guild in the database
        ticketDb[message.guild.id] = { categoryId: categoryId };
        fs.writeFileSync(ticketDbPath, JSON.stringify(ticketDb, null, 2));

        // Create the ticket panel embed
        const embed = new MessageEmbed()
            .setColor('#2f3136')
            .setTitle('🎟 NeMu Tickets')
            .setDescription('Please click on the 🎟 button to open a ticket.');

        const row = new MessageActionRow().addComponents(
            new MessageButton()
                .setCustomId('create_ticket')
                .setLabel('🎟')
                .setStyle('SUCCESS')
        );

        // Send the panel to the specified channel
        channel.send({ embeds: [embed], components: [row] });

        // Inform the user that the panel was set up successfully
        message.channel.send({
            content: `Ticket panel successfully set up in <#${channelId}> with ticket category <#${categoryId}>.`
        });
    }
};
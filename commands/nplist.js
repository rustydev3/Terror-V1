const { MessageEmbed } = require('discord.js');
const path = require('path');
const configPath = path.resolve(__dirname, '../config.json');
const config = require(configPath);

module.exports = {
    name: 'nplist',
    aliases: ['np-list'],
    ownerPermit: true, // Ensuring only the bot owner can run this command
    run: async (client, message, args) => {
        // Check if the user is the bot owner
        if (message.author.id !== config.ownerId) {
            return message.channel.send('This command is only executable by the bot owner.');
        }

        const npList = config.np;
        if (!npList || npList.length === 0) {
            return message.channel.send('No users found in the No-Prefix list.');
        }

        // Create the embed message
        const embed = new MessageEmbed()
            .setTitle('No-Prefix List')
            .setColor('#2f3136')
            .setFooter('Made By YGamer');

        let description = '';

        npList.forEach(userId => {
            const user = client.users.cache.get(userId);
            if (user) {
                description += `@${user.tag} (${userId})\n`;
            } else {
                description += `Unknown User (${userId})\n`;
            }
        });

        embed.addField('Users:', description);

        // Send the embed message
        return message.channel.send({ embeds: [embed] });
    }
};
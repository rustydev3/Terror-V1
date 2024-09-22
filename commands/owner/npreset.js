const fs = require('fs');
let config = require('../../config.json');

module.exports = {
    name: 'npreset',
    category: 'owner',
    description: 'Resets the np array and reloads the config. Only the bot owner can use this command.',
    run: async (client, message, args) => {
        console.log('npreset command loaded');

        // Log the owner ID and author ID for debugging
        console.log('Owner ID from config:', config.owner);
        console.log('Author ID:', message.author.id);

        // Check if the user is the bot owner
        if (message.author.id !== config.owner) {
            return message.channel.send(`${client.emoji.cross} You do not have permission to use this command.`);
        }

        try {
            // Clear the np array
            config.np = [];

            // Save the updated config.json
            fs.writeFileSync('./config.json', JSON.stringify(config, null, 2), 'utf-8');

            // Reload the config to reflect the changes
            delete require.cache[require.resolve('../../config.json')];
            config = require('../../config.json'); // Reload the updated config

            return message.channel.send(`${client.emoji.tick} The np array has been reset and config reloaded.`);
        } catch (err) {
            console.error(err);
            return message.channel.send(`${client.emoji.cross} There was an error resetting the np array.`);
        }
    },
};
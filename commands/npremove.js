const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'npremove',
    description: 'Removes a user from the np variable in config.json',
    async run(client, message, args, prefix) {
        const configPath = path.join(__dirname, '../config.json');
        const config = require(configPath);

        // Debugging
        console.log(`Message Author ID: ${message.author.id}`);
        console.log(`Config Owner ID: ${config.ownerId}`);

        // Ensure the message author is the owner
        if (message.author.id !== config.ownerId) {
            return message.reply(`${client.emoji.cross} | You do not have permission to use this command.`);
        }

        // Get the user ID from the mention or argument
        const user = message.mentions.users.first() || args[0];

        let userId;
        if (typeof user === 'string') {
            userId = user;
        } else if (user && user.id) {
            userId = user.id;
        } else {
            return message.reply(`${client.emoji.cross} | Please mention a valid user or provide a valid user ID.`);
        }

        // Ensure np is an array
        if (!Array.isArray(config.np)) {
            config.np = [];
        }

        // Check if the user ID is not in the np array
        if (!config.np.includes(userId)) {
            return message.reply(`${client.emoji.cross} | This user is not in the np list.`);
        }

        // Remove the user ID from the np array
        config.np = config.np.filter(id => id !== userId);

        fs.writeFile(configPath, JSON.stringify(config, null, 2), (err) => {
            if (err) {
                console.error('Error updating config.json:', err);
                return message.reply(`${client.emoji.cross} | There was an error updating the np variable.`);
            }

            // Confirmation message
            message.reply(`${client.emoji.tick} | Successfully removed <@${userId}> from the no-prefix`);
        });
    }
};
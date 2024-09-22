const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'prefix',
    aliases: ['setprefix', 'set-prefix'],
    punitop: false,
    adminPermit: false,
    ownerPermit: false,
    cat: 'admin',
    run: async (client, message, args, prefix) => {
        // Check if the user has MANAGE_GUILD permissions
        if (!message.member.permissions.has('MANAGE_GUILD')) {
            return message.channel.send({
                embeds: [new MessageEmbed()
                    .setColor('#2f3136')
                    .setDescription(`${client.emoji.cross} | You require \`MANAGE_GUILD\` permissions to change the guild prefix.`)]
            });
        }

        // Display the current prefix if no argument is provided
        if (!args[0]) {
            return message.channel.send({
                embeds: [new MessageEmbed()
                    .setColor('#2f3136')
                    .setDescription(`${client.emoji.info} | My prefix for this server is: \`${prefix}\``)]
            });
        }

        // Ensure the new prefix isn't more than 3 characters
        if (args[0].length > 3) {
            return message.channel.send({
                embeds: [new MessageEmbed()
                    .setColor('#2f3136')
                    .setDescription(`${client.emoji.cross} | The prefix cannot be longer than 3 characters.`)]
            });
        }

        // Ensure only one argument is passed for the prefix
        if (args[1]) {
            return message.channel.send({
                embeds: [new MessageEmbed()
                    .setColor('#2f3136')
                    .setDescription(`${client.emoji.cross} | Please provide only one argument for the new prefix.`)]
            });
        }

        // Check if the prefix is being reset to the default
        if (args[0] === client.config.prefix) {
            client.data.delete(`prefix_${message.guild.id}`);
            return message.channel.send({
                embeds: [new MessageEmbed()
                    .setColor('#2f3136')
                    .setDescription(`${client.emoji.tick} | Successfully reset the guild prefix to: \`${client.config.prefix}\``)]
            });
        }

        // Set the new prefix
        client.data.set(`prefix_${message.guild.id}`, args[0]);
        return message.channel.send({
            embeds: [new MessageEmbed()
                .setColor('#2f3136')
                .setDescription(`${client.emoji.tick} | Guild prefix has been set to: \`${args[0]}\``)]
        });
    }
};
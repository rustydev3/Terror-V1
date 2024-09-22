const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "purge",
    aliases: ["clear"],
    cat: "util", // This ensures the command is categorized under 'Utility Commands'
    run: async (client, message, args) => {
        if (!message.member.permissions.has('MANAGE_MESSAGES')) {
            return message.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(`#2f3136`)
                    .setDescription(`${client.emoji.cross} | You do not have permission to manage messages.`)]
            });
        }

        const deleteCount = parseInt(args[0], 10);

        if (!deleteCount || deleteCount < 1 || deleteCount > 100) {
            return message.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(`#2f3136`)
                    .setDescription(`${client.emoji.cross} | Please provide a number between 1 and 100 for the number of messages to delete.`)]
            });
        }

        try {
            await message.channel.bulkDelete(deleteCount + 1, true);
            message.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(`#2f3136`)
                    .setDescription(`${client.emoji.tick} | Successfully deleted ${deleteCount} messages.`)]
            }).then(msg => {
                setTimeout(() => msg.delete(), 5000);
            });
        } catch (error) {
            console.error('Error deleting messages: ', error);
            message.channel.send({
                embeds: [new MessageEmbed()
                    .setColor(`#2f3136`)
                    .setDescription(`${client.emoji.cross} | There was an error trying to purge messages in this channel.`)]
            });
        }
    }
};
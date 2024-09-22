const { MessageEmbed, Permissions } = require("discord.js");

module.exports = {
    name: "unban",
    aliases: ['ub'],
    pnuitop: false,
    adminPermit: false,  // Set to false as requested
    cat: 'admin',
    ownerPermit: false,
    run: async (client, message, args, prefix) => {
        // Check if the user has BAN_MEMBERS permission
        if (!message.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) {
            return message.channel.send({
                embeds: [new MessageEmbed()
                    .setColor('#2f3136')
                    .setDescription(`${client.emoji.cross} | You require \`BAN_MEMBERS\` permission to use this command.`)]
            });
        }

        // Check if a user ID was provided
        if (!args[0]) {
            return message.channel.send({
                embeds: [new MessageEmbed()
                    .setColor('#2f3136')
                    .setDescription(`${client.emoji.cross} | Command Usage: \`${prefix}unban <user_id>\``)]
            });
        }

        // Fetch the ban list
        const bans = await message.guild.bans.fetch().catch(() => { });
        if (!bans) {
            return message.channel.send({
                embeds: [new MessageEmbed()
                    .setColor('#2f3136')
                    .setDescription(`${client.emoji.cross} | I couldn't retrieve the ban list.`)]
            });
        }

        // Check if the user is in the ban list
        const user = bans.find(ban => ban.user.id === args[0]);

        if (!user) {
            return message.channel.send({
                embeds: [new MessageEmbed()
                    .setColor('#2f3136')
                    .setDescription(`${client.emoji.cross} | I couldn't find that user in the ban list.`)]
            });
        }

        // Set the reason for the unban
        let reason = args.slice(1).join(' ') || 'No Reason given';

        // Unban the user
        message.guild.members.unban(user.user.id, `${message.author.tag} | ${reason}`).then(() => {
            return message.channel.send({
                embeds: [new MessageEmbed()
                    .setColor('#2f3136')
                    .setDescription(`${client.emoji.tick} | Successfully **Unbanned** ${user.user.tag} executed by: ${message.author.tag}\n${client.emoji.arrow} Reason: ${reason}`)]
            });
        }).catch(err => {
            return message.channel.send({
                embeds: [new MessageEmbed()
                    .setColor('#2f3136')
                    .setDescription(`${client.emoji.cross} | I couldn't unban that user. Please check my permissions or try again.`)]
            });
        });
    }
};
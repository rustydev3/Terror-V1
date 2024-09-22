const { MessageEmbed } = require("discord.js");

module.exports = {
  name: 'invites',
  aliases: ['invi'],
  cat: 'util',
  usage: '?invites [user]',
  run: async (client, message, args) => {
    // Check if a user is mentioned, otherwise use the message author
    const targetUser = message.mentions.users.first() || message.author;
    const guild = message.guild;
    const member = guild.members.cache.get(targetUser.id);
    
    // Fetch the user's invite data
    const invites = await guild.invites.fetch();
    const userInvites = invites.filter(i => i.inviter && i.inviter.id === targetUser.id);
    
    let totalInvites = 0;
    let fakeInvites = 0;
    let rejoined = 0;
    let left = 0;

    userInvites.forEach(invite => {
      totalInvites += invite.uses;
    });

    // Calculate fake invites (accounts created less than 3 months ago)
    const threeMonthsAgo = Date.now() - 90 * 24 * 60 * 60 * 1000;
    guild.members.cache.forEach(member => {
      if (member.joinedTimestamp < threeMonthsAgo && userInvites.some(i => i.inviter.id === targetUser.id)) {
        fakeInvites++;
      }
    });

    // Placeholder logic for rejoined and left (as this depends on external invite tracking data)
    // You should integrate an invite tracker database to store this data properly
    rejoined = Math.floor(Math.random() * 5); // Replace with actual rejoin tracking logic
    left = Math.floor(Math.random() * 3);     // Replace with actual left tracking logic

    // Determine if the user has any fake invites
    const fakeStatus = fakeInvites > 0 ? `${client.emoji.cross} Fake Invites: ${fakeInvites}` : `${client.emoji.tick} No Fake Invites`;

    // Create embed with the invite info
    const inviteEmbed = new MessageEmbed()
      .setColor('#2f3136')
      .setTitle(`${targetUser.tag}'s Invite Stats`)
      .setDescription(`
        ${client.emoji.invites} Total Invites: **${totalInvites}**
        ${client.emoji.cross} Left: **${left}**
        ${client.emoji.arrow} Rejoined: **${rejoined}**
        ${fakeStatus}
      `)
      .setFooter('Invite Tracker | YGamer');

    message.channel.send({ embeds: [inviteEmbed] });
  }
};
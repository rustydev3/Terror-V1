const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "gend",
  aliases: ["giveawayend", "endgiveaway"],
  cat: "util",
  usage: "?gend <messageID>",
  run: async (client, message, args) => {
    const giveawayRole = message.guild.roles.cache.find(role => role.name === "Giveaway Manager");

    // Check if the user has the necessary permissions or role
    if (
      !message.member.permissions.has("MANAGE_GUILD") &&
      (!giveawayRole || !message.member.roles.cache.has(giveawayRole.id))
    ) {
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor(`#2f3136`)
            .setDescription(`${client.emoji.cross} | You need **Manage Server** permission or the 'Giveaway Manager' role to end a giveaway.`)
        ]
      });
    }

    // Check if message ID is provided
    const messageID = args[0];
    if (!messageID) {
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor(`#2f3136`)
            .setDescription(`${client.emoji.cross} | Please provide the message ID of the giveaway.`)
        ]
      });
    }

    // Fetch the giveaway message
    let giveawayMessage;
    try {
      giveawayMessage = await message.channel.messages.fetch(messageID);
    } catch (err) {
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor(`#2f3136`)
            .setDescription(`${client.emoji.cross} | Could not find a message with that ID.`)
        ]
      });
    }

    if (!giveawayMessage.embeds.length || !giveawayMessage.embeds[0].title.includes("Giveaway")) {
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor(`#2f3136`)
            .setDescription(`${client.emoji.cross} | The provided message ID does not belong to a giveaway.`)
        ]
      });
    }

    // Extract prize from the embed
    const description = giveawayMessage.embeds[0].description;
    const prizeMatch = description.match(/Prize:\s*(.*)/);
    if (!prizeMatch) {
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor(`#2f3136`)
            .setDescription(`${client.emoji.cross} | Could not extract the prize from the giveaway.`)
        ]
      });
    }
    const prize = prizeMatch[1];

    // Process reactions
    const reaction = giveawayMessage.reactions.cache.get("🎉");
    if (!reaction) {
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor(`#2f3136`)
            .setDescription(`${client.emoji.cross} | No reactions found on the giveaway message.`)
        ]
      });
    }

    const users = await reaction.users.fetch();
    const validEntries = users.filter(user => !user.bot);
    if (validEntries.size === 0) {
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor(`#2f3136`)
            .setDescription(`${client.emoji.cross} | No valid entries, cannot end the giveaway.`)
        ]
      });
    }

    // Pick a winner
    const winner = validEntries.random();
    message.channel.send(
      `🎉 Congratulations <@${winner.id}>! You won the ${prize}** giveaway!`
    );
  }
};
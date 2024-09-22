const { MessageEmbed } = require("discord.js");
const ms = require("ms");

module.exports = {
  name: "gstart",
  aliases: ["stgiveaway", "startgiveaway"],
  cat: "util",
  usage: "?gstart <time> <winners> <item>",
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
            .setDescription(`${client.emoji.cross} | You need **Manage Server** permission or the 'Giveaway Manager' role to start a giveaway.`)
        ]
      });
    }

    // Extract and validate arguments
    const time = args[0];
    const winnerCount = parseInt(args[1]);
    const prize = args.slice(2).join(" ");

    if (!time || !ms(time)) {
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor(`#2f3136`)
            .setDescription(`${client.emoji.cross} | Please provide a valid time duration (e.g., 10s, 1m, 1h).`)
        ]
      });
    }

    if (isNaN(winnerCount) || winnerCount < 1) {
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor(`#2f3136`)
            .setDescription(`${client.emoji.cross} | Please specify a valid number of winners (at least 1).`)
        ]
      });
    }

    if (!prize) {
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor(`#2f3136`)
            .setDescription(`${client.emoji.cross} | Please provide a prize for the giveaway.`)
        ]
      });
    }

    // Giveaway logic
        const giveawayMessage = await message.channel.send({
          embeds: [
            new MessageEmbed()
              .setTitle("🎉 Giveaway! 🎉")
              .setColor("#2f3136")
              .setDescription(`**Prize:** ${prize}\n**Winners:** ${winnerCount}\n**Hosted by:** ${message.author}\n**Ends in:** ${ms(ms(time), { long: true })}`)
              .setTimestamp(Date.now() + ms(time))
              .setFooter("React with 🎉 to enter!"),
          ],
        });

        giveawayMessage.react("🎉");

    // Wait for the giveaway to end
    setTimeout(async () => {
      const reactions = giveawayMessage.reactions.cache.get("🎉");
      const users = await reactions.users.fetch();
      const validUsers = users.filter(user => !user.bot);

      if (validUsers.size < winnerCount) {
        return message.channel.send(`${client.emoji.cross} | Not enough participants to draw a winner.`);
      }

      // Select winners
      const winners = validUsers.random(winnerCount);

      message.channel.send(
        `🎉 | Congratulations ${winners.map(w => `<@${w.id}>`).join(", ")}! You won **${prize}**!`
      );
    }, ms(time));
  },
};
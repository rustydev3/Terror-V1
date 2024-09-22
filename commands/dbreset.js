const mongoose = require('mongoose');
const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'dbreset',
  description: 'Resets the MongoDB database',
  category: 'punit', // Change category as needed

  run: async (client, message, args) => {
    // Debugging owner check
    console.log(`Owner ID from config (Type): ${typeof client.config.owner} | Value: ${client.config.owner}`);
    console.log(`Author ID (Type): ${typeof message.author.id} | Value: ${message.author.id}`);

    // Ensure only the bot owner can use this command
    if (message.author.id !== client.config.owner.toString()) {
      return message.channel.send(`${client.emoji.cross} You do not have permission to use this command.`);
    }

    const mongoURL = client.config.mongoURL;

    if (!mongoURL) {
      return message.channel.send(`${client.emoji.cross} MongoDB URL is missing in the config.`);
    }

    try {
      // Connect to MongoDB
      await mongoose.connect(mongoURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });

      // Drop the database
      await mongoose.connection.db.dropDatabase();

      // Disconnect from MongoDB
      await mongoose.disconnect();

      const embed = new MessageEmbed()
        .setColor('GREEN')
        .setTitle('Database Reset')
        .setDescription(`${client.emoji.tick} The database has been successfully reset.`);

      message.channel.send({ embeds: [embed] });
    } catch (err) {
      console.error(err);
      message.channel.send(`${client.emoji.cross} Failed to reset the database. Please try again later.`);
    }
  },
};
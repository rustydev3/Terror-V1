const { MessageEmbed } = require("discord.js");
const mongoose = require('mongoose');
const config = require('../../config.json')

module.exports = {
  name: "dbreset",
  description: "Resets the entire MongoDB database",
  usage: "?dbreset",
  category: "punit",
  run: async (client, message, args) => {
    // Ensure the user is the bot owner or has proper permissions
    if (message.author.id !== client.config.OwnerId) {
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor('#FF0000')
            .setDescription(`${client.emoji.cross} | You do not have permission to reset the database.`)
        ]
      });
    }

    // MongoDB connection URL from config
    const mongoURL = client.config.mongoURL;

    if (!mongoURL) {
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor('#FF0000')
            .setDescription(`${client.emoji.cross} | MongoDB URL is missing in the config.`)
        ]
      });
    }

    try {
      // Connect to MongoDB
      await mongoose.connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true });
      const db = mongoose.connection;

      // Drop all collections in the database
      const collections = await db.db.collections();
      for (let collection of collections) {
        await collection.drop();
      }

      message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor('#00FF00')
            .setDescription(`${client.emoji.tick} | Successfully reset the database.`)
        ]
      });
    } catch (error) {
      console.error('Error resetting the database:', error);
      message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor('#FF0000')
            .setDescription(`${client.emoji.cross} | An error occurred while resetting the database.`)
        ]
      });
    } finally {
      // Disconnect from MongoDB
      mongoose.connection.close();
    }
  }
};
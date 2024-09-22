const { MessageEmbed } = require("discord.js");
const SpotifyWebApi = require('spotify-web-api-node');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, AudioResourceStatus, getVoiceConnection } = require('@discordjs/voice');
const ytdl = require('ytdl-core');
const config = requrire('../../config.json')

module.exports = {
  name: "play",
  aliases: ["p"],
  cat: "utility",
  usage: "?play <song>",
  run: async (client, message, args) => {
    // Check if the user is in a voice channel
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) {
      return message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor(`#2f3136`)
            .setDescription(`${client.emoji.cross} | You need to be in a voice channel to play music.`)
        ]
      });
    }

    // Check if the bot is already connected
    let connection = getVoiceConnection(message.guild.id);
    if (!connection) {
      // Join the voice channel if not connected
      connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: message.guild.id,
        adapterCreator: message.guild.voiceAdapterCreator,
      });
    } else if (connection.joinConfig.channelId !== voiceChannel.id) {
      // If bot is connected to a different channel, move to the current one
      connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: message.guild.id,
        adapterCreator: message.guild.voiceAdapterCreator,
      });
    }

    // Spotify API setup
    const spotifyApi = new SpotifyWebApi({
      clientId: client.config.spotify_id,
      clientSecret: client.config.spotify_sec
    });

    try {
      // Authenticate Spotify
      const data = await spotifyApi.clientCredentialsGrant();
      spotifyApi.setAccessToken(data.body.access_token);

      // Get track info
      const query = args.join(' ');
      const searchData = await spotifyApi.searchTracks(query);
      const track = searchData.body.tracks.items[0];

      if (!track) {
        return message.channel.send({
          embeds: [
            new MessageEmbed()
              .setColor(`#2f3136`)
              .setDescription(`${client.emoji.cross} | No track found for "${query}".`)
          ]
        });
      }

      const trackUrl = track.external_urls.spotify;

      // Placeholder: Use a service or method to get a playable audio stream
      // This is just a mock. You need to replace it with actual audio streaming or conversion.
      const stream = ytdl(trackUrl, { filter: 'audioonly' }); // This is for demonstration purposes only

      const player = createAudioPlayer();
      const resource = createAudioResource(stream, {
        inputType: AudioPlayerStatus.PLAYING,
      });

      player.play(resource);
      connection.subscribe(player);

      player.on(AudioPlayerStatus.Idle, () => {
        console.log('Playback finished');
      });

      player.on('error', error => {
        console.error('Error:', error.message);
      });

      message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor(`#2f3136`)
            .setDescription(`${client.emoji.tick} | Now playing **${track.name}** by **${track.artists[0].name}**.`)
        ]
      });

    } catch (error) {
      console.error(error);
      message.channel.send({
        embeds: [
          new MessageEmbed()
            .setColor(`#2f3136`)
            .setDescription(`${client.emoji.cross} | An error occurred while trying to play the track.`)
        ]
      });
    }
  }
};
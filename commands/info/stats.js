const { MessageEmbed } = require('discord.js');
const os = require('os');
const disk = require('diskusage'); // Ensure you install this: npm install diskusage

module.exports = {
  name: 'stats',
  aliases: ['botstats'],
  cat: 'info',  // Updated to 'info' category
  run: async (client, message, args) => {
    // Total number of users and servers
    const totalUsers = client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);
    const totalServers = client.guilds.cache.size;

    // CPU usage
    const cpuUsage = process.cpuUsage().user / 1024 / 1024; // CPU usage in MB

    // RAM usage
    const usedMemory = process.memoryUsage().heapUsed / 1024 / 1024; // RAM usage in MB
    const totalMemory = os.totalmem() / 1024 / 1024; // Total RAM in MB

    // Disk usage
    const diskInfo = await disk.check(os.platform() === 'win32' ? 'C:' : '/'); // Check C: drive for Windows or root on Unix systems
    const usedDisk = diskInfo.used / 1024 / 1024; // Disk used in MB
    const totalDisk = diskInfo.total / 1024 / 1024; // Total disk in MB

    // Create an embed message
    const statsEmbed = new MessageEmbed()
      .setColor('#2f3136')
      .setTitle('Bot Stats')
      .addField('Total Users', totalUsers.toString(), true)
      .addField('Total Servers', totalServers.toString(), true)
      .addField('CPU Usage', `${cpuUsage.toFixed(2)} MB`, true)
      .addField('RAM Usage', `${usedMemory.toFixed(2)} MB / ${totalMemory.toFixed(2)} MB`, true)
      .addField('Disk Usage', `${usedDisk.toFixed(2)} MB / ${totalDisk.toFixed(2)} MB`, true)
      .setFooter('Stats provided by Lunar');

    // Send the embed message
    message.channel.send({ embeds: [statsEmbed] });
  }
};
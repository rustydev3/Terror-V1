module.exports = async (client) => {
  client.on("ready", async () => {
    console.log(`NeMu | ${client.user.tag} Has Logged In!\nNeMu | Server: https://discord.gg/dMHBxKPUDG\nNeMu | Add NeMu to your server now!!.`)
    client.user.setPresence({
      activities: [{
        name: `?help | Made By YGamer`,
        type: "STREAMING",
        url: "https://twitch.tv/abeditz21",
      }],
      status: "STREAMING"
    });
  });
};
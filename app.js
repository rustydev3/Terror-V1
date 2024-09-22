const { Client, Collection, MessageEmbed, WebhookClient, Intents } = require("discord.js");
const disk = require('diskusage');
const { mongoURL, token, webhook_error, prefix } = require("./config.json");
const { Database } = require("quickmongo");
const ascii = require("ascii-table");
const Commandtable = new ascii().setHeading("NeMu", "Commands", "Status");
const EventsTable = new ascii().setHeading("NeMu", "Events", "Status");
const path = require('path');
const fs = require('fs');
const { Configuration, OpenAIApi } = require('openai');
const ms = require("ms");

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_INVITES,
        Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
        Intents.FLAGS.GUILD_BANS,
        Intents.FLAGS.GUILD_WEBHOOKS,
        Intents.FLAGS.GUILD_PRESENCES,
        Intents.FLAGS.MESSAGE_CONTENT
    ],
    partials: ["CHANNEL", "GUILD_MEMBER", "MESSAGE", "REACTION", "USER"],
    allowedMentions: {
        repliedUser: true,
        parse: ["everyone", "roles", "users"]
    }
});

// Initialize bot client properties
client.commands = new Collection();
client.cools = new Collection();
client.data = new Database(mongoURL);
client.data2 = new Database(mongoURL);
client.data3 = new Database(mongoURL);

async function connectDatabases() {
    try {
        await client.data.connect();
        await client.data2.connect();
        await client.data3.connect();
        console.log('Mongo Connect Success');
    } catch (err) {
        console.error('Failed to connect to MongoDB:', err);
    }
}

connectDatabases();

client.config = require('./config.json'); // Load config correctly
client.emoji = require('./emojis.json');

// Recursive function to load commands
function loadCommands(directory) {
    fs.readdirSync(directory).forEach(file => {
        const fullPath = path.join(directory, file);
        const stats = fs.statSync(fullPath);

        if (stats.isDirectory()) {
            loadCommands(fullPath);
        } else if (file.endsWith('.js')) {
            try {
                const command = require(fullPath);
                if (command.name) {
                    client.commands.set(command.name, command);
                    Commandtable.addRow("NeMu", command.name, "✅");
                } else {
                    console.warn(`Command file ${file} is missing a name property.`);
                }
            } catch (err) {
                console.error(`Failed to load command from ${fullPath}:`, err);
            }
        }
    });
}

loadCommands(path.join(__dirname, 'commands'));
console.log(Commandtable.toString());

// Load events
fs.readdirSync("./events/").forEach(e => {
    require(`./events/${e}`)(client);
    let eve = e.split(".")[0];
    EventsTable.addRow("NeMu", eve, "✅");
});
console.log(EventsTable.toString());

// Remove any existing 'messageCreate' event listeners to prevent duplicates
client.removeAllListeners('messageCreate');

// Centralized Command Handling
client.on('messageCreate', async message => {
    if (message.author.bot) return; // Ignore bot messages

    console.log(`Received message [ID: ${message.id}] from ${message.author.tag}: "${message.content}"`);

    const content = message.content.trim();
    const usedPrefix = client.config.np.includes(message.author.id) ? '' : prefix;

    // Debugging log to check prefix matching
    console.log(`Used prefix: "${usedPrefix}" | Message starts with prefix: ${content.startsWith(prefix)}`);

    if (!content.startsWith(usedPrefix)) return;

    const args = content.slice(usedPrefix.length).trim().split(/ +/);
    const cmdName = args.shift().toLowerCase();
    const command = client.commands.get(cmdName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(cmdName));

    // Debugging log to check if command is found
    console.log(`Command found: ${!!command}`);

    if (command) {
        try {
            await command.run(client, message, args, usedPrefix);

            // Check if the command is one that modifies the config
            if (cmdName === 'npadd' || cmdName === 'npremove') {
                // Reload the configuration file
                client.config = require('./config.json');
                console.log('Configuration reloaded.');
            }

            console.log(`Executed command: ${cmdName}`);
        } catch (error) {
            console.error('Error executing command:', error);
            // Send detailed error message
            await message.channel.send({ embeds: [new MessageEmbed().setColor('#ff0000').setTitle('Error').setDescription(`There was an error executing the command: ${error.message}\n\`\`\`js\n${error.stack}\`\`\``)] });
        }
    }
});

client.login(token);

const web = new WebhookClient({ url: webhook_error });
process.on("unhandledRejection", err => {
    console.error('Unhandled Rejection:', err);
    web.send({ embeds: [new MessageEmbed().setColor('#2f3136').setDescription(`\`\`\`js\n${err}\`\`\``)] });
});
process.on("uncaughtException", er => {
    console.error('Uncaught Exception:', er);
    web.send({ embeds: [new MessageEmbed().setColor('#2f3136').setDescription(`\`\`\`js\n${er}\`\`\``)] });
});


// --

 // Do these things : remove command usage debugging, no-prefix user should only be able to use command without prefix it shouldn't give them any perms like to ban without perms on anything.
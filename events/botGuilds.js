const { MessageEmbed } = require('discord.js');
module.exports = async (client) => {
    client.on('guildCreate', async guild => {
        console.log('guildCreate event triggered:', guild); // Debugging log

        client.data3.set(`whitelist_${guild.id}`, []);
        client.data3.set(`wlEv_${guild.id}`, []);
        client.data3.set(`antiLinks_${guild.id}`, []);

        client.data2.set(`setup_${guild.id}`, 'none');

        let mainChannel;

        // Use a for...of loop with await to ensure all channels are properly checked
        for (const channel of guild.channels.cache.values()) {
            if (channel.type === 'GUILD_TEXT' && guild.members.me.permissionsIn(channel).has('SEND_MESSAGES')) {
                mainChannel = channel;
                break;
            }
        }

        if (!mainChannel) {
            console.log('No suitable main channel found.'); // Debugging log
            return;
        }

        let embed = new MessageEmbed()
            .setColor('#2f3136')
            .setAuthor({ name: '| Thanks For Inviting Me', iconURL: client.user.displayAvatarURL({ dynamic: true }) })
            .setDescription(
                `Hey There I am ${client.user.username}.

                ${client.emoji.dot} I am the top discord bot that you only need To Secure your servers from getting nuked or wizzed.
                ${client.emoji.dot} I am powered with most of the security modules to secure your servers easily by using the mode you want.
                ${client.emoji.dot} I am fulfilled with powerful automation like auto recovery and much more! for free.
                
                __**Need Help ?**__
                My default prefix is : \`${client.config.prefix}\`
                Try me with the command : \`${client.config.prefix}help\`
                
                __**How to Use Me ?**__
                1. Setup Anti Nuke System with - \`${client.config.prefix}setup\` or \`${client.config.prefix}antinuke\`
                2. Guild Owner may whitelist the required people or bots and may enjoy his server safely.
                
                Sponsored By : [VPS Sponsor](${client.config.support_server_link})
                Invite : [${client.user.username}](https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands)`
            )
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
            .setTimestamp();

        try {
            await mainChannel.send({ embeds: [embed] });
        } catch (error) {
            console.error('Failed to send message to the main channel:', error);
        }

        let own = await guild.fetchOwner();
        try {
            const invite = await mainChannel.createInvite({ maxAge: 0, reason: 'I am creating this invite for My developer(s)' });
            const emb = new MessageEmbed()
                .setColor('#2f3136')
                .setAuthor({ name: '| New Guild Created!', iconURL: guild.iconURL({ dynamic: true }) })
                .addFields([
                    { name: '**Server Name**', value: `${guild.name}` },
                    { name: '**Server Id**', value: `${guild.id}` },
                    { name: '**Owner Info**', value: `${guild.members.cache.get(own.id) ? guild.members.cache.get(own.id).user.tag : 'Unknown User'}` },
                    { name: '**MemberCount**', value: `${guild.memberCount} Members` },
                    { name: '**Invite**', value: `https://discord.gg/${invite.code}` },
                    { name: '**Guild Created**', value: `<t:${Math.round(guild.createdTimestamp / 1000)}:R>` },
                    { name: '**Guild Joined**', value: `<t:${Math.round(guild.joinedTimestamp / 1000)}:R>` },
                    { name: `${client.user.username}'s Server Count`, value: `${client.guilds.cache.size}` },
                    { name: `${client.user.username}'s Users Count`, value: `${client.guilds.cache.reduce((a, g) => a + g.memberCount, 0)}` }
                ])
                .setTimestamp();

            const logChannel = client.channels.cache.get(client.config.guildLogs);
            if (logChannel) {
                await logChannel.send({ embeds: [emb] });
            } else {
                console.error('Log channel not found.');
            }
        } catch (error) {
            console.error('Failed to create invite or send message to the log channel:', error);
        }
    });

    client.on('guildDelete', async guild => {
        console.log('guildDelete event triggered:', guild); // Debugging log

        const emb = new MessageEmbed()
            .setColor('#2f3136')
            .setAuthor({ name: '| New Guild Deleted!', iconURL: guild.iconURL({ dynamic: true }) })
            .addFields([
                { name: '**Server Name**', value: `${guild.name}` },
                { name: '**Server Id**', value: `${guild.id}` },
                { name: '**MemberCount**', value: `${guild.memberCount} Members` },
                { name: '**Guild Created**', value: `<t:${Math.round(guild.createdTimestamp / 1000)}:R>` },
                { name: `${client.user.username}'s Server Count`, value: `${client.guilds.cache.size}` },
                { name: `${client.user.username}'s Users Count`, value: `${client.guilds.cache.reduce((a, g) => a + g.memberCount, 0)}` }
            ])
            .setTimestamp();

        const logChannel = client.channels.cache.get(client.config.guildLogs);
        if (logChannel) {
            await logChannel.send({ embeds: [emb] });
        } else {
            console.error('Log channel not found.');
        }
    });
}
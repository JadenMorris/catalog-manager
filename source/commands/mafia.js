const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "mafia",
    description: '',
    execute: async function (message, args) {
        if(message.author.id !== '394757049893912577') return;
        let channel = client.channels.cache.get('954816351032180776'),
            users = args.slice(1);
        if(args[0] == 'open') {
            users.map(user => channel.updateOverwrite(user, { 'VIEW_CHANNEL': true }));
            message.channel.send(`Открыла доступ ${users.map(f => `\`${client.users.cache.get(f)?.username}\``).join("\n")}`);
        } else if(args[0] == 'close') {
            users.map(user => channel.updateOverwrite(user, { 'VIEW_CHANNEL': null }));
            message.channel.send(`Закрыла доступ ${users.map(f => `\`${client.users.cache.get(f)?.username}\``).join("\n")}`);
        }
    }
}

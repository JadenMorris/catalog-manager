const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "keywords",
    description: '',
    execute: async function (message, args) {
        let channel = message.guild.channels.cache.get(message.mentions.channels.first()?.id || args[1]);
        if(!message.member.roles.cache.get('686639786672652363') && !message.member.roles.cache.get('784789396062208022') && message.author.id !== '571006178444836875') return;
        if((!channel || !args.slice(2).join(" ")) && (args[0] == 'add' || args[0] == 'remove')) return;
        if(args[0] === 'add') {
            let [word] = await con.query(`SELECT * FROM KeyWords WHERE Word = ? AND Channel = ?`,[args.slice(2).join(" ")?.trim(), channel.id]);
            if(word[0]) return message.channel.send('Данное ключевое слово уже добавлено к этому каналу.')
            con.query(`INSERT INTO KeyWords(Word, Channel) VALUES (?, ?)`, [args.slice(2).join(" "), channel.id])
            message.channel.send(`Ключевое слово \`${args.slice(2).join(" ")?.trim()}\` добавлено к каналу \`#${channel.name}\`.`);
        } else if(args[0] == 'remove') {
            let [word] = await con.query(`SELECT * FROM KeyWords WHERE Word = ? AND Channel = ?`,[args.slice(2).join(" ")?.trim(), channel.id]);
            if(!word[0]) return message.channel.send('Данное ключевое слово не добавлено к этому каналу.')
            con.query(`DELETE FROM KeyWords WHERE Word = ? AND Channel = ?`, [args.slice(2).join(" "), channel.id])
            message.channel.send(`Ключевое слово \`${args.slice(2).join(" ")?.trim()}\` удалено с канала \`#${channel.name}\`.`);
        } else {
            let list;
            if(channel) [list] = await con.query(`SELECT * FROM KeyWords WHERE Channel = ?`,[channel.id])
            else [list] = await con.query(`SELECT * FROM KeyWords`);

            let embed = new MessageEmbed()
                .setColor("#2F3136")
            if(channel) {
                embed.setTitle(`Ключевые слова \`#${channel.name}\``)
                    .setDescription(list.map(x => `\`${x.Word}\``).join(', '));
            } else {
                embed.setTitle(`Ключевые слова`);
                [...new Set(list.map(x => x.Channel))].map(x => embed.addField(`#${message.guild.channels.cache.get(x).name}`, list.filter(f => f.Channel == x).map(f => `\`${f.Word}\``).join("\n"),true));
            }
            message.channel.send(embed);
        }
    }
}

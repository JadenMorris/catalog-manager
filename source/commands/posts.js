const moment = require('moment');
const { MessageEmbed } = require('discord.js')

module.exports = {
    name: "posts",
    execute: async function (message, args, locale, sys) {
        if(!args[0]) return;
        let [nps] = await con.query(`SELECT * FROM GuildsList WHERE (text LIKE '%<@${args[0]}>%' OR text LIKE '%<@!${args[0]}>%' OR id = '${args[0]}') AND deleted=0`);

        message.channel.send(nps.map(x => x.link).join("\n").replace(/canary\./g,'') || "Не удалось найти ни единого поста.",{split:"\n"});
    }}
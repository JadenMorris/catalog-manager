let { Interaction } = require('slash-commands-discord');
module.exports = {
    name: "settings",
    aliases: [],
    description: '',
    execute: async function (message, args, locale, sys) {
if(!message.token || !message.guild.members.cache.get(message.member.user.id).roles.cache.has("830107365638275133")) return;
const interaction = new Interaction(message, client.token, client.user.id);
let guild = await con.query(`SELECT * FROM Partners WHERE id = ?`,[message.guild_id])
if(!client.guilds.cache.get(message.guild_id).members.cache.get(message.member.user.id).permissions.has("MANAGE_GUILD")) return interaction.reply(new (require('discord-slash').Message)().addEmbed(
      new (require('discord-slash').MessageEmbed)()
        .title(`Ошибка!`)
        .description(`Вы не имеете право на использование данной команды.
            Для её использования вам необходимо право на: **Управление сервером**.`)
        .footer(message.member.user.username,`https://img.icons8.com/nolan/96/error.png`)
        .color("16711680")
    ).message)
if(message.data.options.length === 0) return;
let updates = [];
if(message.data.options.find(f=>f.name === 'smalltext')) {
    con.query(`UPDATE Partners SET Small_T = ? WHERE id="${message.guild_id}"`,[message.data.options.find(f=>f.name === 'smalltext').value]);
    updates.push({name:"Краткий текст",value:message.data.options.find(f=>f.name === 'smalltext').value});
}
if(message.data.options.find(f=>f.name === 'largetext')) {
    con.query(`UPDATE Partners SET Large_T = ? WHERE id="${message.guild_id}"`,[message.data.options.find(f=>f.name === 'largetext').value]);
    updates.push({name:"Полный текст",value:message.data.options.find(f=>f.name === 'largetext').value});
}
let embed_content = new (require('discord-slash').MessageEmbed)()
        .title(`Изменение`)
        .footer(message.member.user.username,`https://img.icons8.com/nolan/96/approve-and-update.png`)
        .color("000033");
updates.map(value=>embed_content.newField(value.name,value.value,false))
interaction.reply(new (require('discord-slash').Message)().addEmbed(embed_content).message)
}}
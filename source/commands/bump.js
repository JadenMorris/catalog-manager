const { MessageEmbed } = require('discord.js'),
      { Interaction } = require('slash-commands-discord');
function msparse(duration) {
    let seconds = Math.floor((duration / 1000) % 60),
    minutes = Math.floor((duration / (1000 * 60)) % 60),
    hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
return {hours,minutes,seconds}
}
let sklonenie = (number, txt, cases = [2, 0, 1, 1, 1, 2]) => txt[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
module.exports = {
    name: "bump",
    aliases: ['ban'],
    description: '',
    execute: async function (message, args, locale, sys) {
if(!message.token) return;
const interaction = new Interaction(message, client.token, client.user.id);
let guild = await con.query(`SELECT * FROM Partners WHERE id = ?`,[message.guild_id])
if(guild[0][0].cooldown > Date.now()){ 
let time = msparse(guild[0][0].cooldown-Date.now()),time_array = [`**${time.seconds} ${sklonenie(time.seconds,["секунду","секунды","секунд"])}**`,`${time.minutes>0?` **${time.minutes} ${sklonenie(time.minutes,["минуту","минуты","минут"])}**`:""}`,`${time.hours>0?` **${time.hours} ${sklonenie(time.hours,["час","часа","часов"])}**`:""}`].filter(f=>f.length>1).reverse(),time_text = time_array.length>1?`${time_array.slice(0,-1).join(",")} и ${time_array[time_array.length-1]}`:time_array[0];
return client.api.interactions(message.id,message.token).callback.post({
data:{
    type:4,
    data:{embeds:[new MessageEmbed()
        .setTitle(`${message.guild.name}`)
        .setDescription(`Не так быстро. Для следующего повышения сервера подождите ${time_text}`)
        .setFooter(message.member.user.username,`https://img.icons8.com/nolan/512/clock.png`)
        .setColor("000033")
        .setURL(`https://catalogserverov.ml`)
    ]}
}})
}
con.query(`INSERT INTO Bumps (Guild,User) VALUES (?,?)`,[message.guild.id,message.member.user.id])
con.query(`UPDATE Partners SET cooldown = ?,Bumps=Bumps+1 WHERE id = ?`,[Date.now()+10800000,message.guild_id])
client.api.interactions(message.id,message.token).callback.post({
data:{
    type:4,
    data:{embeds:[new MessageEmbed()
        .setTitle(`${message.guild.name}`)
        .setDescription(`**UP!** Вы успешно повысили сервер на мониторинге!
        	Приходите через **3 часа**, чтобы повысить его снова!`)
        .setFooter(message.member.user.username,`https://img.icons8.com/nolan/96/good-quality.png`)
        .setColor("000033")
        .setURL(`https://catalogserverov.ml`).toJSON()
    ]}
}})
setTimeout(async()=>{
    let [data] = await con.query(`SELECT * FROM Remind WHERE Guild = ?`,[message.guild.id])
    if(!data[0]?.Channel || !data[0]?.Text) return;
    let [bumps] = await con.query(`SELECT * FROM Bumps WHERE Guild = ?`,[message.guild.id]),
        count = data[0].Text.match(/{{users\([0-9]+\)}}/g)||[]
    if(count[0]) count.map(f=>data[0].Text = data[0].Text.replace(f,message.guild.roles.cache.get(f.match(/[0-9]+/g)?.[0])?.members.map(c=>c).join(" ")))
    client.channels.cache.get(data[0].Channel).send(data[0].Text.replace(/{{guild}}/g,message.guild.name).replace(/{{count}}/g,bumps.length)).then(con.query(`UPDATE Remind SET Last = ? WHERE Guild = ?`,[Date.now(),message.guild.id]))
},require('ms')('3h'))
}}
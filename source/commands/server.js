const { MessageEmbed } = require('discord.js'),
	  { Interaction } = require('slash-commands-discord'),
	  fetch = require('node-fetch'),
	  sim = require('string-similarity');
function chunk(arr, chunk) {
  var i, j, tmp = [];
  for (i = 0, j = arr.length; i < j; i += chunk) {
    tmp.push(arr.slice(i, i + chunk));
  }
  return tmp;
}
module.exports = {
    name: "server",
    description: 'Информация об указанном сервере.',
    use:"server [invite/name]",
    execute: async function (message, args, locale, sys) {
if(!message.token) return;
client.api.interactions[message.id][message.token].callback.post({data:{
  type:5
}})
// if(!message.token || !message.guild.members.cache.get(message.member.user.id).roles.cache.has("830107365638275133")) return;
let point = message.data.options[0].value;
if(point.includes('discord.')){point = await client.fetchInvite(point);/*icon=`https://cdn.discordapp.com/icons/${point.guild.id}/${point.guild.icon}`;*/point=point.guild.id;}
let guild = await con.query(`SELECT * FROM GuildsList WHERE id = ? OR name = ? OR invite=? OR link = ? ORDER BY created+0 DESC`,[point, point, point, point]),
    erremb = new MessageEmbed().setTitle(`Информация о сервере \`${point}\` отсутствует`)
.setColor(16711680)

if(!guild[0][0]) return client.api.webhooks[client.user.id][message.token].messages['@original'].patch({
data:{
    embeds:[erremb]
}})
let target = await client.fetchInvite(guild[0][0].invite);
guild[0] = guild[0].filter(c=>c.name === sim.findBestMatch(target.guild.name,guild[0].map(f=>f.name)).bestMatch.target)
if(!guild[0][0]) return client.api.webhooks[client.user.id][message.token].messages['@original'].patch({
data:{
    embeds:[erremb]
}})
let users = [],channels=[],pms_l=[],i=1,lvl,roleplay = [
  '834538927523889222',
  '834538863674261566',
  '747839944759705641',
  '747807883202134087',
  '668385586121408552',
  '834538893277134909',
  '747807905818083488',
  '834538821071798332',
  '642200117322973201',
  '747807923010535515'
];
guild[0].forEach(c=>{
	pms_l.find(f=>f === c.author)?1:pms_l.push(c.author)
	users.find(f=>f === c.text.split("\n")[1]?.match(/[0-9]+/g)?.[0])?1:users.push(c.text.split("\n")[1]?.match(/[0-9]+/g)?.[0])
	channels.find(f=>f === c.link.split("/")[c.link.split("/").length-2])?1:channels.push(c.link.split("/")[c.link.split("/").length-2])
})
if((roleplay.some(c=>channels.includes(c)) && target.memberCount >= 200) || target.memberCount >= 300) lvl = 3
	else if((roleplay.some(c=>channels.includes(c)) && target.memberCount >= 100) || target.memberCount >= 150) lvl = 2
		else lvl = 1
let embed = new MessageEmbed().setTitle(point)
.setURL(guild[0][0].link)
.addField(`ID`,`\`${target.guild.id}\``,true)
.addField(`Уровень`,`**${(lvl === 3?message.guild.roles.cache.get("622501691107049502").name:lvl === 2?message.guild.roles.cache.get("622501656591990784").name:message.guild.roles.cache.get("688654966675603491").name).slice('Партнёр ['.length,-1)}**\n(${target.memberCount})`,true)
.addField(`Всего постов`,`**${guild[0].length}**`,true)
.addField(`Представители`,users.map(c=>`<@${c}>`).join(","),true)
.addField(`Пиар-менеджеры`,pms_l.map(c=>`<@${c}>`).join(","),true)
.addField(`Публиковалось в каналах`,channels.map(c=>`<#${c}>`).join(","),true)
.addField(`Последнее обновление`,`**${require('moment')(Number(guild[0][0].created)).format("LL [ в ] HH:mm:ss")}**`,true)
.addField(`Возможности`,`**Лента** ${lvl>1?"<:yes:833090699993284628>":"<:no:833090734201503754>"}
**Ссылки** ${lvl>1?"<:yes:833090699993284628>":"<:no:833090734201503754>"}
**Вложения** ${lvl>2?"<:yes:833090699993284628>":"<:no:833090734201503754>"}`,true)
.addField('\u200B', '\u200B',true)
.setThumbnail(`https://cdn.discordapp.com/icons/${target.guild.id}/${target.guild.icon}`)
.setFooter(`ID: ${target.guild.id} | ${message.member.user.username}`,'https://img.icons8.com/nolan/2x/faq.png')
.setColor("#000033")
if(target.guild.banner) embed.setImage(`https://cdn.discordapp.com/banners/${target.guild.id}/${target.guild.banner}.png?size=2048`)
// chunk(guild[0].map(c=>`[#${i++}](${c.link})`).join("\n").split("\n"),10).map((c,ii)=>embed.addField(`Публикации #${ii+1}`,c.join(","),true))
client.api.webhooks[client.user.id][message.token].messages['@original'].patch({
data:{
    embeds:[embed.toJSON()],
}})
}}
const { MessageEmbed } = require('discord.js'),
	  { Interaction } = require('slash-commands-discord');
function groupBy(key) {
  return function group(array) {
    return array.reduce((acc, obj) => {
      const property = obj[key];
      acc[property] = acc[property] || [];
      acc[property].push(obj);
      return acc;
    }, {});
  };
}

module.exports = {
    name: "info",
    aliases: [],
    description: '',
    execute: async function (message, args, locale, sys) {
if(!message.token) return;
client.api.interactions[message.id][message.token].callback.post({data:{
  type:5
}})
let channels = message.guild.channels.cache,
	members = message.guild.members.cache,
	guilds = await con.query(`SELECT * FROM Partners ORDER BY bumps DESC`),
	[bumps] = await con.query(`SELECT * FROM Bumps WHERE Guild='${message.guild.id}' ORDER BY Date DESC`)
guilds[0] = guilds[0].filter(f=>client.guilds.cache.get(f.id))
	guild = guilds[0].find(f=>f.id===message.guild.id),
	users = groupBy('User')(bumps)
	users = Object.keys(users).sort((a,b)=>users[b].length-users[a].length)[0];
let embed = new MessageEmbed().setTitle(message.guild.name)
.setURL(`https://catalogserverov.ml/`)
.addField(`Владелец`,`\`${message.guild.owner?.user.tag}\``,true)
.addField(`Место на сайте`,`${client.emojis.cache.get('826504951085531207')} \`#${guilds[0].indexOf(guild)+1}\``,true)
.addField(`Повышений`,`${client.guilds.cache.get('792740568768708638').emojis.cache.get('826517919621578842').toString()} \`${bumps.length||0}\``,true)
.addField(`Последний повысивший`,`**${client.users.cache.get(bumps[0]?.User)?.username||"Отсутствует"}**`,true)
.addField(`Лидер по повышениям`,`**${client.users.cache.get(users)?.username||"Отсутствует"}**`,true)
.addField(`Регион`,'**Россия** <:ru:826519754100834364>',true)
.addField(`Пользователей`,`<:online:826506946017361920> \`${members.filter(c=>c.user.presence.status === 'online').size}\`
<:dnd:826506944114196543> \`${members.filter(c=>c.user.presence.status === 'dnd').size}\`
<:idle:826506945132625957> \`${members.filter(c=>c.user.presence.status === 'idle').size}\`
<:offline:826506943950487562> \`${members.filter(c=>c.user.presence.status === 'offline').size}\``,true)
.addField(`Каналов`,`<:text:826512921630081037> \`${channels.filter(c=>c.type === 'text').size}\`
<:voice:826512920807604245> \`${channels.filter(c=>c.type === 'voice').size}\``,true)
.addField(`Буст`,`<:boost:826498100482932836>**Бустов:** \`${message.guild.premiumSubscriptionCount}\`
<:boost:826498074733576212> **Уровень:** \`${message.guild.premiumTier}\``,true)
.addField(`Эмодзи`,`<:emoji:826516980566589501> \`${message.guild.emojis.cache.size}\``,true)
.addField(`Ролей`,`<:number:826517919621578842> \`${message.guild.roles.cache.size}\``,true)
.addField(`Дата создания`,`**${require('moment')(message.guild.createdAt).format('ll')}**`,true)
.addField('\u200B', '\u200B')
.addField('Пользовательские теги',`<:tags:843536299594874920> ${JSON.parse(guild.tags||"[]").map(f=>`\`${f}\``).join(",")||"**Отсутствуют**"}`,true)
.addField('Публичные теги',`<:tags:843536299594874920> ${guild.public_tags.length>1?guild.public_tags.split(",").map(f=>`\`${f}\``).join(","):"**Отсутствуют**"}`,true)
.setImage(`https://cdn.discordapp.com/banners/${message.guild.id}/${message.guild.banner}.png?size=2048`)
if(message.guild.icon) embed.setThumbnail(message.guild.iconURL({size:2048,dynamic:true}))
client.api.webhooks[client.user.id][message.token].messages['@original'].patch({data:{
    embeds:[embed.toJSON()]
}})
}}

const os = require('os')
function num(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
module.exports = {
    name: "bot",
    description: 'Информаци о боте',
    execute: async function (message, args, locale, sys) {
client.api.interactions[message.id][message.token].callback.post({data:{
	type:4,
	data:{
	embeds:[new (require('discord.js').MessageEmbed)()
.addField(`Общая информация`,`<:guilds:878623777846624328> **Серверов** \`${num(client.guilds.cache.size)}\`
<:users:878623776642834484> **Пользователей** \`${num(client.guilds.cache.reduce((a,b)=>b.memberCount+a,0))}\``,true)
.addField(`Техническая информация`,`<:ping:878624895641202729> **Задержка** \`${client.ws.ping}ms\`
<:memory:878627719183753216> **Память** \`${Math.floor((os.totalmem()-os.freemem())/1000000)}MB / ${Math.floor(os.totalmem()/1000000)}MB\``,true)
.addField(`\u200b`,`\u200b`)
.addField(`Мониторинг`,`<:global:878629110312751134> [catalogserverov.ml](https://catalogserverov.ml)`,true)
.addField(`Сервер поддержки`,`<:info:878634825827897375> [discord.gg/nKPdC9V](https://discord.gg/nKPdC9V)`,true)
.setFooter(`©️ Каталог Серверов | ${client.user.id}`,client.user.avatarURL())
.setColor("#29090b")]
}}})
}}
const { MessageEmbed } = require('discord.js');
module.exports = {
    name: "top",
    execute: async function (data, args, locale, sys) {
let pms = client.guilds.cache.get('604636579545219072').roles.cache.get('608600358570295307').members.array(),
	top = {},
	date = {},
	buttons = [["За сегодня",1,"top_o_day",{}],["За отчёт",1,"top_report",{}],["За неделю",1,"top_o_week",{}],["За месяц",1,"top_o_month",{}],["За всё время",1,"top_all",{}]]
buttons[buttons.indexOf(buttons.find(f=>f[2] === data.data.custom_id))].push(true)
let elem = buttons[buttons.indexOf(buttons.find(f=>f[2] === data.data.custom_id))]
data.custom_id = data.data.custom_id.split("_").slice(1).join("_")
Promise.all(pms.map(member=>data.member.user.id !== '661686866587942953'?SPartners.partner_con(member.user.id,data.custom_id):SPartners.partner_nocon(member.user.id,data.custom_id))).then(top=>{
		top = top.sort((a,b)=>b.partners-a.partners);
client.channels.cache.get(data.channel_id).messages.fetch(data.message.id).then(msg=>msg.editComponent(new MessageEmbed().setTitle(`Топ по партнёрствам ${elem[0].toLowerCase()}`)
			.setDescription(top.filter(f=>client.users.cache.get(f.id)).map(f=>`\`${top.indexOf(f)+1}. ${client.users.cache.get(f.id).tag}\`** — ${f.partners}**`).join("\n")).setColor("#000033").setFooter(`По запросу ${data.member.user.username}`,client.users.cache.get(data.member.user.id).displayAvatarURL({dynamic:true,size:2048,format:"png"})).setTimestamp(),buttons))
})


}} 

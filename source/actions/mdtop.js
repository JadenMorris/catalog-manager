const { MessageEmbed } = require('discord.js');
const moment = require('moment');

module.exports = {
    name: "mdtop",
    execute: async function (data, args, locale, sys) {
//[{"type": 2,"label": "Устные предупреждения","style": 2,"custom_id": "mdtop_type_verbals",disabled:true},{"type": 2,"label": "Предупреждения","style": 2,"custom_id": "mdtop_type_warns"},{"type": 2,"label": "Муты","style": 2,"custom_id": "mdtop_type_mute"},{"type": 2,"label": "Баны","style": 2,"custom_id": "mdtop_type_bans"},{"type": 2,"label": "Закрытые жалобы","style": 2,"custom_id": "mdtop_type_reports"}]
let buttons_list = data.message.components;
if(args[0] == 'type'){
buttons_list[0].components.find(x => x.disabled).disabled = false;
buttons_list[0].components.find(x => x.custom_id == data.data.custom_id).disabled = true;

let type = args[1][0].toUpperCase()+args[1].slice(1),
	elem = 'предупреждениям';
	switch(type){
		case "Bans":elem = 'банам';break;
		case "Mutes":elem = 'мутам';break;
		case "Complaints":elem = 'закрытым жалобам';break;
	}
	let time = {start:'',end: moment().add("days",1).format("YYYY-MM-DD")};
	switch(data.message.embeds[0].title.split("за")[1].trim()){
		case "сегодня": time.start = moment().add("days",-1).format("YYYY-MM-DD");break;
		case "вчера": time = {start: moment().add("days",-2).format("YYYY-MM-DD"),end: moment().format("YYYY-MM-DD")};break;
		case "неделю": time.start = moment().startOf('week').add('days',-1).format("YYYY-MM-DD");break;
		case "месяц": time.start = moment().startOf('month').add("days",-1).format("YYYY-MM-DD");break;
	}

let md = client.guilds.cache.get('604636579545219072').roles.cache.get('677397817966198788').members.array(),
		[top] = await con.query(`SELECT User,SUM(${type}) as ${type} FROM MDStats WHERE Date > ? AND Date < ? GROUP BY User ORDER BY ${type} DESC`,[time.start,time.end])
		md.filter(x => !top.find(f => f.User == x.user.id)).map(x => top.push({User:x.user.id,count:0}))
client.channels.cache.get(data.channel_id).messages.fetch(data.message.id).then(msg=>msg.editComponent({embed:new MessageEmbed().setTitle(`Топ по ${elem} за `+data.message.embeds[0].title.split("за ")[1])
			.setDescription(top.map(f=>`\`${top.indexOf(f)+1}. ${client.users.cache.get(f.User).tag}\`** — ${isNaN(f.count)?f[type]:f.count}**`).join("\n")).setColor("#000033").setFooter(`По запросу ${data.member.user.username}`,client.users.cache.get(data.member.user.id).displayAvatarURL({dynamic:true,size:2048,format:"png"})).setTimestamp(),components:buttons_list}))
} else {
	let start = args[0],
		end = args[1] != 0?args[1]:moment().add("days",1).format("YYYY-MM-DD"),
		type = 'Warns';
		switch(data.message.embeds[0].title.split("за")[0].trim()) {
			case "Топ по банам": type = "Bans";break;
			case "Топ по мутам": type = "Mutes";break;
			case "Топ по закрытым жалобам": type = "Complaints";break;
		}
		console.log(start,end,type)
buttons_list[1].components.find(x => x.disabled).disabled = false;
buttons_list[1].components.find(x => x.custom_id == data.data.custom_id).disabled = true;
let md = client.guilds.cache.get('604636579545219072').roles.cache.get('677397817966198788').members.array(),
		[top] = await con.query(`SELECT * FROM MDStats WHERE Date > ? AND Date < ? GROUP BY User ORDER BY ${type} DESC`,[start,end])
		md.filter(x => !top.find(f => f.User == x.user.id)).map(x => top.push({User:x.user.id,count:0}))
client.channels.cache.get(data.channel_id).messages.fetch(data.message.id).then(msg=>msg.editComponent({embed:new MessageEmbed().setTitle(`${data.message.embeds[0].title.split(" за ")[0]} ${data.message.components[1].components.find(x => x.custom_id == data.data.custom_id).label.toLowerCase()}`)
			.setDescription(top.map(f=>`\`${top.indexOf(f)+1}. ${client.users.cache.get(f.User).tag}\`** — ${isNaN(f.count)?f[type]:f.count}**`).join("\n")).setColor("#000033").setFooter(`По запросу ${data.member.user.username}`,client.users.cache.get(data.member.user.id).displayAvatarURL({dynamic:true,size:2048,format:"png"})).setTimestamp(),components:buttons_list}))
}
}} 

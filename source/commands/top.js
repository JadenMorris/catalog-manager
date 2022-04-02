const { MessageEmbed } = require('discord.js');
let sklonenie = (number, txt, cases = [2, 0, 1, 1, 1, 2]) => txt[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]],
	moment = require('moment')
function divine(x, delimiter) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, delimiter || " ");
}
function toTime(timestamp,time = []){
let duration = new moment.duration(timestamp)
let days = parseInt(duration.asDays()),
	hours = parseInt(duration.asHours())%24,
	min = parseInt(duration.asMinutes())%60,
	seconds = parseInt(duration.asSeconds())%60
	if(days > 0) time.push(`${days} ${sklonenie(days,['день','дня','дней'])}`)
    	if(hours > 0) time.push(`${hours} ${sklonenie(hours,['час','часа','часов'])}`)
        	if(min > 0 && time.length !== 2) time.push(`${min} ${sklonenie(min,['минута','минуты','минут'])}`)
        		if(time.length !== 2) time.push(`${seconds} ${sklonenie(seconds,['секунда','секунды','секунд'])}`);
return time.join(" и ");
}
module.exports = {
    name: "top",
    description: 'Топ по активности',
    execute: async function (message, args, locale, sys) {
client.api.interactions[message.id][message.token].callback.post({data:{
  type:5
}})
if(message.data.options[0].value === 'active'){
function interval(dateo,datet,dates=[]){
    let time = Math.floor((datet-dateo)/86400000)
    for(i = 0;i<time;i++) dates.push({moment:require('moment')(datet-(86400000*i)).format("DD/MM"),db:require('moment')(datet-(86400000*i)).format("DD.MM.YY")})
    return dates.reverse()
}
	let [active] = await con.query(`SELECT * FROM Msgs WHERE Guild = ? AND Date IN (${interval(Date.now()-86400000*14,Date.now()).map(f=>`"${f.db}"`).join(",")})`,[message.guild.id]),
		[voice] = await con.query(`SELECT * FROM Voice WHERE Guild = ? AND Date IN (${interval(Date.now()-86400000*14,Date.now()).map(f=>`"${f.db}"`).join(",")})`,[message.guild.id]),
		users = {messages:{},voice:{}}
active.filter(f=>client.users.cache.get(f.User) && !client.users.cache.get(f.User).bot).map(f=>users['messages'][f.User]?users['messages'][f.User]+=+f.Count:users['messages'][f.User]=+f.Count)
voice.filter(f=>client.users.cache.get(f.User) && !client.users.cache.get(f.User).bot).map(f=>users['voice'][f.User]?users['voice'][f.User]+=+f.Time:users['voice'][f.User]=+f.Time)
users =  {messages:Object.entries(users.messages).sort((a,b)=>b[1]-a[1]).slice(0,5),voice:Object.entries(users.voice).sort((a,b)=>b[1]-a[1]).slice(0,5)}
return client.api.webhooks[client.user.id][message.token].messages['@original'].patch({data:{
	embeds:[new MessageEmbed().setTitle(`Топ пользователей за 14 дней`)
.addField(`Сообщения | Топ 5`,users.messages.map(f=>`\`${users.messages.indexOf(f)+1}st.\` **${client.users.cache.get(f[0])?.username||"Неизвестный пользователь"}**: \`${divine(f[1],",")} ${sklonenie(f[1],["сообщение","сообщения","сообщений"])}\``))
.addField(`Войс время | Топ 5`,users.voice.map(f=>`\`${users.voice.indexOf(f)+1}st.\` **${client.users.cache.get(f[0])?.username||"Неизвестный пользователь"}**: \`${toTime(f[1])}\``))
.setFooter(client.user.username,client.user.avatarURL())
.setTimestamp()
.setColor("#000033").toJSON()]
}})
} else if(message.data.options[0].value == 'manager'){
let pms = client.guilds.cache.get('604636579545219072').roles.cache.get('608600358570295307').members.array(),
	top = {}
Promise.all(pms.map(member=>message.member.user.id !== '661686866587942953'?SPartners.partner_con(member.user.id,"o_day"):SPartners.partner_nocon(member.user.id,"o_day"))).then(top=>{
		top = top.sort((a,b)=>b.partners-a.partners)
		message.author = client.users.cache.get(message.member.user.id)
return client.api.webhooks[client.user.id][message.token].messages['@original'].patch({data:{
			embeds:[new MessageEmbed().setTitle(`Топ по партнёрствам за сегодня`)
			.setDescription(top.map(f=>`\`${top.indexOf(f)+1}. ${client.users.cache.get(f.id).tag}\`** — ${f.partners}**`).join("\n")).setColor("#000033").setFooter(`По запросу ${message.author.username}`,message.author.displayAvatarURL({dynamic:true,size:2048,format:"png"})).setTimestamp().toJSON()],
			components: [{
            	"type": 1,
            	"components": [{"type": 2,"label": "За сегодня","style": 1,"custom_id": "top_o_day",disabled:true},{"type": 2,"label": "За отчет","style": 1,"custom_id": "top_report"},{"type": 2,"label": "За неделю","style": 1,"custom_id": "top_o_week"},{"type": 2,"label": "За месяц","style": 1,"custom_id": "top_o_month"},{"type": 2,"label": "За всё время","style": 1,"custom_id": "top_all"}]
        	}]
			}})
})
} else {
let md = client.guilds.cache.get('604636579545219072').roles.cache.get('677397817966198788').members.array(),
		[top] = await con.query(`SELECT User,SUM(Warns) as Warns  FROM MDStats WHERE Date > ? GROUP BY User ORDER BY Warns DESC`,[moment().add('days',-1).startOf('days').format("YYYY-MM-DD")])
		message.author = client.users.cache.get(message.member.user.id)
		md.filter(x => !top.find(f => f.User == x.user.id)).map(x => top.push({User:x.user.id,Warns:0}))
 client.api.webhooks[client.user.id][message.token].messages['@original'].patch({data:{
			embeds:[new MessageEmbed().setTitle(`Топ по предупреждениям за сегодня`)
			.setDescription(top.map(f=>`\`${top.indexOf(f)+1}. ${client.users.cache.get(f.User).tag}\`** — ${f.Warns}**`).join("\n")).setColor("#000033").setFooter(`По запросу ${message.author.username}`,message.author.displayAvatarURL({dynamic:true,size:2048,format:"png"})).setTimestamp().toJSON()],
			components: [{
            	"type": 1,
            	"components": [{"type": 2,"label": "За сегодня","style": 1,"custom_id": `mdtop_${moment().add('days',-1).format("YYYY-MM-DD")}_0_1`,disabled:true},{"type": 2,"label": "За вчера","style": 1,"custom_id": `mdtop_${moment().add('days',-2).format("YYYY-MM-DD")}_${moment().format("YYYY-MM-DD")}`},{"type": 2,"label": "За неделю","style": 1,"custom_id": `mdtop_${moment().startOf('week').add('days',-1).format("YYYY-MM-DD")}_0_2`},{"type": 2,"label": "За месяц","style": 1,"custom_id": `mdtop_${moment().startOf('month').add("days",-1).format("YYYY-MM-DD")}_0_3`},{"type": 2,"label": "За всё время","style": 1,"custom_id": "mdtop_0"}]
        	},{
            	"type": 1,
            	"components": [{"type": 2,"label": "Предупреждения","style": 2,"custom_id": "mdtop_type_warns", disabled:true},{"type": 2,"label": "Муты","style": 2,"custom_id": "mdtop_type_mutes"},{"type": 2,"label": "Баны","style": 2,"custom_id": "mdtop_type_bans"},{"type": 2,"label": "Закрытые жалобы","style": 2,"custom_id": "mdtop_type_complaints"}]
        	}].reverse()
			}})

}
}}
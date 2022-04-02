const { MessageEmbed } = require('discord.js');
let text = '',info = {};
function send(msg){
require('node-fetch')(`https://discordapp.com/api/v9/channels/${info.channel}/messages`,{
	body:JSON.stringify({content:text}),
	method:"POST",
	headers:{
		Authorization:account[0].account,
		"Content-Type":"application/json"
	}
}).then(c=>c.json()).then((e)=>{
	client.channels.cache.get(data.channel_id).send(new MessageEmbed().setDescription(`**Сервер \`${msg.content.split("\n")[1].split("—").slice(0,-1).join("—").trim().slice(2,-2)}\` был успешно опубликован в канал <#${partnerst[args[0]].channel}>**`).setColor("GREEN"))
})
}
module.exports = {
    name: "send",
    execute: async function (data, args, locale, sys) {
if(partnerst[args[0]].author !== data.member.user.id) return;

	let msg = await client.channels.cache.get(data.channel_id).messages.fetch(partnerst[args[0]].message),
	[account] = await con.query(`SELECT * FROM Managers WHERE user = ?`,[data.member.user.id])
if(args[1]){
				let channel = client.channels.cache.get(data.data.values[0]),name = ''
				if(channel.name === 'впи') name = 'ВПИ'
					else if(channel.parent.id === '747807222247063642' && channel.id !== '747807923010535515') name = `RolePlay сервер.`
						else name = `${channel.parent.name.slice('Каталог: '.length)}(${channel.name})`;
	Promise.all([setChannel(channel,msg,data.member.user.id)||function(){return 1}()]).then(async(t)=>{
	if(t != 0) name = t;
	client.channels.cache.get(data.channel_id).messages.delete(data.message.id)
	msg.edit(msg.content.replace(msg.content.split("\n")[1],`${msg.content.split("\n")[1]}${name}`))	
	partnerst[args[0]].channel = data.data.values[0]
	msg.channel.send(new MessageEmbed().setTitle(`Выбор партнёра`).setDescription(`Введите действительное ID партнёра.`)).then((mes)=>{
		msg.channel.awaitMessages(m => m.author.id == data.member.user.id,{max: 1, time: 30000}).then(collected => {
			if(isNaN(collected.first().content)) return msg.channel.send(new MessageEmbed().setTitle(`Упс..`).setDescription(`Пожалуйста, перепроверьте правильность введённого ID.`).setColor("#FF0000"))
			partnerst[args[0]].partner = collected.first().content;
			collected.first().react("878624895641202729")
			mes.delete()
			msg.content = msg.content.replace(msg.content.split("\n")[2],`**Партнёр** — <@${collected.first().content}>`)
			msg.edit(msg.content)
			let MsgData = {
				content:msg.content,
				components:data.message.components
			}
		require('node-fetch')(`https://discordapp.com/api/v9/channels/${partnerst[args[0]].channel}/messages`,{
			body:JSON.stringify({content:MsgData.content.split("\n").slice(1).join("\n").slice(0,-3)}),
			method:"POST",
			headers:{
				Authorization:account[0].account,
				"Content-Type":"application/json"
			}
		}).then(c=>c.json()).then((e)=>{
			if(e.message == '401: Unauthorized') return client.channels.cache.get(data.channel_id).send(new MessageEmbed().setTitle(`Упс..`).setDescription(`Похоже, что вы не привязали ваш аккаунт к боту или ваш токен устарел. Попробуйте перепривязать его для использования автоматической публикации.`).setColor("#FF0000"))
			if(!client.guilds.cache.get('604636579545219072').members.cache.get(partnerst[args[0]].partner).roles.cache.find(x => x.name.includes('Партнёр'))) require('node-fetch')(`https://discordapp.com/api/v9/channels/642190411867226112/messages`,{
				body:JSON.stringify({content:`K.np ${partnerst[args[0]].partner}`}),
				method:"POST",
				headers:{
					Authorization:account[0].account,
					"Content-Type":"application/json"
				}
			})
			client.channels.cache.get(data.channel_id).send(new MessageEmbed().setDescription(`**Сервер \`${MsgData.content.split("\n")[1].split("—").slice(0,-1).join("—").trim().slice(2,-2)}\` был успешно опубликован в канал <#${partnerst[args[0]].channel}>**`).setColor("GREEN"))
		})
		})
	})
	})
	return;
}
	if(partnerst[args[0]].partner?.length > 1 && partnerst[args[0]].thematic?.length > 1) {
			let MsgData = {
				content:msg.content,
				components:data.message.components
			}
		require('node-fetch')(`https://discordapp.com/api/v9/channels/${partnerst[args[0]].channel}/messages`,{
			body:JSON.stringify({content:MsgData.content.split("\n").slice(1).join("\n").slice(0,-3)}),
			method:"POST",
			headers:{
				Authorization:account[0].account,
				"Content-Type":"application/json"
			}
		}).then(c=>c.json()).then((e)=>{
			MsgData.components[0].components[0].disabled = true;
			msg.editComponent(MsgData)
			if(e.message == '401: Unauthorized') return client.channels.cache.get(data.channel_id).send(new MessageEmbed().setTitle(`Упс..`).setDescription(`Похоже, что вы не привязали ваш аккаунт к боту или ваш токен устарел. Попробуйте перепривязать его для использования автоматической публикации.`).setColor("#FF0000"))
			MsgData.components[0].components[1].disabled = true;
			msg.editComponent(MsgData)
			client.channels.cache.get(data.channel_id).send(new MessageEmbed().setDescription(`**Сервер \`${MsgData.content.split("\n")[1].split("—").slice(0,-1).join("—").trim().slice(2,-2)}\` был успешно опубликован в канал <#${partnerst[args[0]].channel}>**`).setColor("GREEN"))
		})
	}else{
			let MsgData = {
				content:msg.content,
				components:data.message.components
			}
		MsgData.components[0].components[0].disabled = true;
		msg.editComponent(MsgData)
	         let parents = ['642102626070036500','747807222247063642','642085815597400065','642104779270782986'],
	             ignore = ['703575115958452266','764911620111204383','728932829026844672'],channels = {};
	        parents.map((parent,index)=>client.channels.cache.filter(f=>f.parentID === parent && !ignore.includes(f.id)).map(channel=>channels[channel.parentID]?channels[channel.parentID].push({id:channel.id,name:channel.name}):channels[channel.parentID]=[{id:channel.id,name:channel.name}]))
				let comps = {"components": Object.keys(channels).map((f,i)=>({
					            "type": 1,
					            "components": [{
					                    "type": 3,
					                    "custom_id": `send_${args[0]}_${args[1]}_${i}`,
					                    "options":channels[f].map(c=>(
					                        {
					                            "label": c.name,
					                            "value": c.id,
					                       })),
					                    "min_values": 1,
					                    "max_values": 1,
					                    "placeholder":client.channels.cache.get(f).name.slice(`Каталог: `.length)
					                }]
					        }))
					    }
				client.channels.cache.get(data.channel_id).sendComponent(new MessageEmbed().setTitle(`Выбор тематики`).setDescription('Выберите тематику сервера.'),comps)
	}
}} 


async function setChannel(channel,mes,author){
	return new Promise(async(res,rej)=>{
		if(channel.id !== '747807923010535515') return res(0);
		let op = await mes.channel.send(new MessageEmbed().setTitle(`Оповещение`).setDescription(`Укажите принадлежность фандома.`))
		mes.channel.awaitMessages(m => m.author.id == author,{max: 1, time: 30000}).then(collected => {
			res(`RolePlay(Фандом|${collected.first().content})`)
			op.delete()
		})
	})
}
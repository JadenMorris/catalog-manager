const { MessageEmbed } = require('discord.js');
function uniq(a) {
    var seen = {};
    return a.filter(function(item) {
        return seen.hasOwnProperty(item) ? false : (seen[item] = true);
    });
}
module.exports = {
    name: "edit",
    execute: async function (data, args, locale, sys) {
if(partnerst[args[0]]?.author !== data.member.user.id && partnerst[args[1]]?.author !== data.member.user.id) return;
if(!['channel','partner'].includes(args[0])) client.channels.cache.get(data.channel_id).sendComponent(new MessageEmbed().setTitle(`Изменение`).setDescription(`Нажмите на кнопку для выбора цели.`),[["Партнёр",2,`edit_partner_${args[0]}`,{id:"878629661339447336"}],["Канал",2,`edit_channel_${args[0]}`,{id:"826512921630081037"}]])
	else if(args[0] == 'channel'){
		if(!isNaN(args[2])) {
			client.channels.cache.get(data.channel_id).messages.fetch(data.message.id).then(msg=>{
				partnerst[args[1]].channel = data.data.values[0]
				let channel = client.channels.cache.get(data.data.values[0]),name = ''
				if(channel.name === 'впи') name = 'ВПИ'
					else if(channel.parent.id === '747807222247063642' && channel.id !== '747807923010535515') name = `RolePlay сервер.`
						else name = `${channel.parent.name.slice('Каталог: '.length)}(${channel.name})`;
				client.channels.cache.get(data.channel_id).messages.fetch(partnerst[args[1]].message).then(async mes=>{
					if(channel.id == '747807923010535515') {
						let op = await mes.channel.send(new MessageEmbed().setTitle(`Оповещение`).setDescription(`Укажите принадлежность фандома.`))
						mes.channel.awaitMessages(m => m.author.id == data.member.user.id,{max: 1, time: 30000}).then(collected => {
							name = `RolePlay(Фандом|${collected.first().content})`;
							mes.edit(mes.content.replace(mes.content.split("\n")[1].split(/—/g)[mes.content.split("\n")[1].split(/—/g).length-1],` ${name}`))
							op.delete()
							return msg.editComponent({
								embeds:[new MessageEmbed().setTitle(`Изменение канала`).setDescription(`Канал сервера был успешно изменён на <#${data.data.values[0]}>`).toJSON()],
								components:[]
							}).then(c=>setTimeout(()=>{msg.channel.messages.delete(c.id)},2500))
						})
					} else {
						msg.editComponent({
							embeds:[new MessageEmbed().setTitle(`Изменение канала`).setDescription(`Канал сервера был успешно изменён на <#${data.data.values[0]}>`).toJSON()],
							components:[]
						}).then(c=>setTimeout(()=>{msg.channel.messages.delete(c.id)},2500))
						mes.edit(mes.content.replace(mes.content.split("\n")[1].split(/—/g)[mes.content.split("\n")[1].split(/—/g).length-1],` ${name}`))
					}
				})
			})
		}
			else {
	         let parents = ['642102626070036500','747807222247063642','642085815597400065','642104779270782986'],
	             ignore = ['703575115958452266','764911620111204383','728932829026844672'],channels = {};
	        parents.map((parent,index)=>client.channels.cache.filter(f=>f.parentID === parent && !ignore.includes(f.id)).map(channel=>channels[channel.parentID]?channels[channel.parentID].push({id:channel.id,name:channel.name}):channels[channel.parentID]=[{id:channel.id,name:channel.name}]))
				let comps = {"components": Object.keys(channels).map((f,i)=>({
					            "type": 1,
					            "components": [{
					                    "type": 3,
					                    "custom_id": `edit_channel_${args[1]}_${i}`,
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
				client.channels.cache.get(data.channel_id).messages.delete(data.message.id)
				client.channels.cache.get(data.channel_id).sendComponent(new MessageEmbed().setTitle(`Изменение канала`).setDescription('Выберите нужный канал из списка'),comps)
			}
	} else if(args[0] == 'partner') {
		if(!isNaN(args[2])) {
				client.channels.cache.get(data.channel_id).messages.fetch(data.message.id).then(msg => {
					msg.editComponent({
						embeds: [new MessageEmbed().setTitle(`Изменение партнёра`).setDescription(`Партнёр сервера успешно изменён на <@${data.data.values[0]}>`).toJSON()],
						components: []
					}).then(c => setTimeout(() => {
						msg.channel.messages.delete(c.id)
					}, 2500))
					partnerst[args[1]].partner = data.data.values[0]
					client.channels.cache.get(data.channel_id).messages.fetch(partnerst[args[1]].message).then(mes => {
						mes.edit(mes.content.replace(mes.content.split("\n")[2], `**Партнёр** — <@${partnerst[args[1]].partner}>`))
					})
				})
		}else if(args[2] == 'new') {
				client.channels.cache.get(data.channel_id).messages.delete(data.message.id);
				client.channels.cache.get(data.channel_id).send(new MessageEmbed().setTitle(`Выбор партнёра`).setDescription(`Введите действительное ID партнёра.`)).then((mes)=> {
					client.channels.cache.get(data.channel_id).awaitMessages(m => m.author.id == data.member.user.id, {
						max: 1,
						time: 30000
					}).then(async collected => {
						if (isNaN(collected.first().content)) return client.channels.cache.get(data.channel_id).send(new MessageEmbed().setTitle(`Упс..`).setDescription(`Пожалуйста, перепроверьте правильность введённого ID.`).setColor("#FF0000"));
						partnerst[args[1]].partner = collected.first().content;
						let member = client.guilds.cache.get('604636579545219072').members.cache.get(partnerst[args[1]].partner);
						if(!member.roles.cache.find(x => x.name.includes('Партнёр'))) {
							let [account] = await con.query(`SELECT * FROM Managers WHERE user = ?`,[data.member.user.id]);
							if(account[0]) {
								require('node-fetch')(`https://discordapp.com/api/v9/channels/642190411867226112/messages`,{
									body:JSON.stringify({content:`K.np ${partnerst[args[1]].partner}`}),
									method:"POST",
									headers:{
										Authorization:account[0].account,
										"Content-Type":"application/json"
									}
								})
							}
						}
						client.channels.cache.get(data.channel_id).messages.fetch(partnerst[args[1]].message).then(msg => {
							msg.edit(msg.content.replace(msg.content.split("\n")[2], `**Партнёр** — <@${partnerst[args[1]].partner}>`))
							mes.delete()
						})
					})
				})
		} else {
				let [partners] = await con.query(`SELECT * FROM GuildsList WHERE id='${partnerst[args[1]].guild}'`)
				partners = uniq(partners.map(f=>f.text.split("\n")[1]?.match(/[0-9]+/g)?.[0]))
				comps = {"components": [{
					            "type": 1,
					            "components": [{
					                    "type": 3,
					                    "custom_id": `edit_partner_${args[1]}_0`,
					                    "options":partners.slice(0,24).filter(f=>client.users.cache.get(f)).map(c=>(
					                        {
					                            "label": client.users.cache.get(c).tag,
					                            "value": c,
					                       })),
					                    "min_values": 1,
					                    "max_values": 1
					                }]
					        },{
                     "type":1,"components":[{"type":2,"style":3,"label":"Добавить партнёра","custom_id":`edit_partner_${args[1]}_new`}]
                 }]
					    }
				client.channels.cache.get(data.channel_id).messages.delete(data.message.id)
				client.channels.cache.get(data.channel_id).sendComponent(new MessageEmbed().setTitle(`Изменение партнёра`).setDescription('Выберите нужного партнёра из списка'),comps)
			}
		}
}} 

let getMessage = async(link)=>{
let lnk = link.split("/")
try{
return client.channels.cache.get(lnk[5]).messages.fetch(lnk[6])
}catch{
return null;
}
}
function gen(){
    var d = new Date().getTime();
    var uuid = 'xxxxxxyx-xxxx-yxxx-yxxx-xxyxxyxxx'.replace(/[xy]/g, function(c){
        let r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
return uuid;
}
let sklonenie = (number, txt, cases = [2, 0, 1, 1, 1, 2]) => txt[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]],
	num = require('numeralize-ru').pluralize

const { MessageEmbed } = require('discord.js');
module.exports = {
    name: "manager",
    description: 'Подключение акканта к боту.',
    use:"manager connect [token]",
    execute: async function (message, args, locale, sys) {
	if(args[0] === 'connect'){
		con.query(`INSERT INTO Managers (user,account) VALUES (?,?) ON DUPLICATE KEY UPDATE account = ?`,[message.author.id,args[1],args[1]])
		message.channel.send(new MessageEmbed().setTitle(`Успешно!`).setDescription(`**Вы успешно привязали свой токен к аккаунту**`).setFooter(message.author.username,`https://img.icons8.com/nolan/96/checkmark.png`).setColor("#000033"))
	}else if(args[0] === 'list'){return;
		con.query(`SELECT * FROM GuildList WHERE User = '${message.author.id}' ORDER BY Num+0 ASC`).then(lists=>{
		let pages = new client.pagination(message.author.id) 
		let posts = lists[0].division(20),
		embeds = [];
		posts.forEach((group,i)=>{
			embeds[i] = new MessageEmbed().setTitle(`Список серверов`).setColor("#000033").setFooter(`Страница: ${i+1} из ${posts.length}`,message.author.avatarURL({size:2048,dynamic:true}))
			group.map(f=>embeds[i].addField(`#${f.Num} ${f.Guild}`,`[Публикация](${f.Link})`,true))
		})
		embeds.map(f=>pages.add(f));
		if(!embeds[0])  return message.channel.send(new MessageEmbed().setTitle(`Ошибка!`).setDescription(`**У вас отсутствуют сервера для обновления**`).setFooter(message.author.username,`https://img.icons8.com/nolan/96/error.png`).setColor("#FF0000"))
		pages.send(message.channel)
		})
	}else if(args[0] === 'add'){return;
		let regex = new RegExp(/.*?(discord\.(gg|io|me|li|com))\/channels\/[0-9]+\/[0-9]+\/[0-9]+/g)
		if(regex.test(args[1])){
			let msg = await getMessage(args[1]),
				guild = {
						name: msg.content.split("\n")[0].match(/\*\*(.*?)\*\*/g)[0].slice(2,-2)
						}
			con.query(`INSERT INTO GuildList (User,Guild,Channel,Link) VALUES ('${message.author.id}',?,'NULL',?)`,[guild.name,args[1]])
		message.channel.send(new MessageEmbed().setTitle(`Успешно!`).setDescription(`**Сервер \`${guild.name}\` был успешно добавлен в ваш список.**`).setFooter(message.author.username,`https://img.icons8.com/nolan/96/checkmark.png`).setColor("#000033"))
		}
	}else if(args[0] === 'delete'){return;
		let guild = await  con.query(`SELECT * FROM GuildList WHERE Num = ${args[1]}`)
		if(guild[0][0].User !== message.author.id) return message.channel.send(new MessageEmbed().setTitle(`Ошибка!`).setDescription(`**Удалить данный сервер из списка может лишь пиар-менеджер, взявший его себе**`).setFooter(message.author.username,`https://img.icons8.com/nolan/96/error.png`).setColor("#FF0000"))
		con.query(`DELETE FROM GuildList WHERE Num = ${args[1]}`)
		message.channel.send(new MessageEmbed().setTitle(`Успешно!`).setDescription(`**Сервер \`${guild[0][0].Guild}\` был успешно удалён из вашего списка**`).setFooter(message.author.username,`https://img.icons8.com/nolan/96/checkmark.png`).setColor("#000033"))
	}else if(args[0] === 'key'){
		if(!client.guilds.cache.get('604636579545219072').members.cache.get(message.author.id)?.roles?.cache.some(role=>["608600358570295307","757890413838467133"].includes(role.id))) return;
		if(message.channel.type !== 'dm') return message.channel.send(new MessageEmbed().setTitle(`Ошибка!`).setDescription(`**Мы ценим безопасность наших сотрудников, поэтому команду с данным аргументом следует писать в личные сообщения боту.**`).setFooter(message.author.username,`https://img.icons8.com/nolan/96/error.png`).setColor("#FF0000")) 
		let keys = await con.query(`SELECT * FROM Api WHERE User = ?`,[message.author.id])
		if(keys[0][0]) return message.channel.send(new MessageEmbed().setDescription(`**Ваш ключ:** \`${keys[0][0].AKey}\``).setFooter(message.author.username,`https://img.icons8.com/nolan/96/checkmark.png`).setColor("#000033"))
			else{
				let key = gen()
				con.query(`INSERT INTO Api (User,AKey) VALUES (?,?)`,[message.author.id,key])
				return message.channel.send(new MessageEmbed().setTitle('Новый ключ сгенерирован').setDescription(`**Ваш ключ:** \`${key}\`\n*Не передавайте его никому.*`).setFooter(message.author.username,`https://img.icons8.com/nolan/96/checkmark.png`).setColor("#000033"))
			}
	}else if(args[0] === 'update'){return;
		if((client.u_cooldown||Date.now()) > Date.now()) return message.channel.send(new MessageEmbed().setTitle(`Ошибка!`).setDescription(`**Для использования данной команды ожидайте \`${((client.u_cooldown-Date.now())/60000).toFixed(1)} мин\`**`).setFooter(message.author.username,`https://img.icons8.com/nolan/96/error.png`).setColor("#FF0000"))
		let posts = await con.query(`SELECT * FROM GuildList WHERE User = '${message.author.id}'`),
			allposts = [].concat.apply([], Object.keys(client.pm_date).map(f=>client.pm_date[f]));
		if(posts[0].length === 0) return message.channel.send(new MessageEmbed().setTitle(`Ошибка!`).setDescription(`**У вас отсутствуют сервера для обновления**`).setFooter(message.author.username,`https://img.icons8.com/nolan/96/error.png`).setColor("#FF0000"))
		// let publics = posts[0].length,
		// 	s = (Math.floor((publics/5)-1)*5800)<0?0:(Math.floor((publics/5)-1)*5800),
		// 	count = s+(publics-((publics/5-1)<0?0:(publics/5)-1))*300,
		// 	hours = Math.floor((count/1000) / 60 / 60),
		// 	min = Math.floor((count/1000) / 60) - (Math.floor((count/1000) / 60 / 60)* 60),
		// 	seconds = Math.floor((count/1000) % 60),
		// 	milli = ((count%1000)/1000).toFixed(1),
		// 	time;
  //   if(hours > 0 && min > 0) time = `${hours} ${sklonenie(hours,['час','часа','часов'])} и ${min%60} ${sklonenie(min,['минуту','минуты','минут'])}`
  //       else if(min > 0 && seconds > 0) time = `${min} ${sklonenie(min,['минуту','минуты','минут'])} и ${seconds} ${sklonenie(seconds,['секунду','секунды','секунд'])}`
  //       	else if(seconds > 0) time = `${seconds+Number(((count%1000)/10000).toFixed(1))} ${num(seconds,'секунду','секунды','секунд')}`
  //       		else time = `меньше секунды`
		// message.channel.send(new MessageEmbed().setDescription(`**Обновление серверов начато, ожидайте \`${time}\`**\n*Примечание: До окончания обновления желательно не писать сообщений, иначе длительность может быть увеличена.*`).setFooter(message.author.username,`https://img.icons8.com/nolan/96/iphone-spinner.png`).setColor("#000033"))
		let date = new Date(new Date(new Date().setDate(new Date().getDate()+1-(new Date().getDay()||7))).setHours(0)).setMinutes(0),
			pub = [].concat.apply([], Object.keys(client.pm_date).map(f=>client.pm_date[f])),
			ss = 0,
			acc = await con.query(`SELECT * FROM Managers WHERE user = '${message.author.id}'`)
		message.channel.send(new MessageEmbed().setDescription(`**Обновление серверов начато, ожидайте \`${((posts[0].length*5000)/60000).toFixed(1)} мин\`**\n*Примечание: До окончания обновления желательно не писать сообщений, иначе длительность может быть увеличена.*`).setFooter(message.author.username,`https://img.icons8.com/nolan/96/iphone-spinner.png`).setColor("#000033"))
		posts[0].forEach(async post=>{
			let ap = allposts.filter(f=>f.content.split("\n")[0].split("—")[0].replace(/\*/g,'').trim() === post.Guild).sort((a,b)=>b.createdTimestamp-a.createdTimestamp)?.[0],
				msg = await getMessage(post.Link) || ap?await getMessage(ap.post):null;
			if(!msg) return;
			let partner = msg.content.split("\n")[1].match(/[0-9]+/g)?.[0],
				user_posts = pub.filter(f=>f.content.split("\n")[0].includes(post.Guild) && f.content.includes(partner) && date < f.createdTimestamp)
			if(user_posts.find(f=>f.createdTimestamp > Date.now()-(Date.now()%86400000)+require('ms')('4h')-require('ms')('24h'))) return;
			partner = client.guilds.cache.get('604636579545219072').members.cache.get(partner)
			if(!partner) return;
			if((partner.roles.cache.has("688654966675603491") && user_posts.length >= 2) || 
				(partner.roles.cache.has("622501656591990784") && user_posts.length >= 3) ||
				(partner.roles.cache.has("622501691107049502") && user_posts.length >= 3)) return;
			setTimeout(()=>{
				require('request')({uri:`https://discordapp.com/api/v8/channels/${msg.channel.id}/messages`,method:"POST",headers:{"Authorization":acc[0][0].account,"Content-Type":"application/json"},body:JSON.stringify({content:msg.content})},(err,rows,body)=>{console.log(`${post.Guild} Updated.`)});
			},ss*5000)
			ss++;
		})
		client.u_cooldown = Date.now()+(posts[0].length*500)+10000
		setTimeout(()=>{
			client.fetchPartners()
		},posts[0].length*500)
	}
}}
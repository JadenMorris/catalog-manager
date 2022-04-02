var apps = require('express')(),
	fs = require('fs');

var options = {
    key: fs.readFileSync('/root/catalog/source/certs/catalog.key'),
    cert: fs.readFileSync('/root/catalog/source/certs/catalog.pem') 
};
var http = require('https').createServer(options,apps);
global.io = require('socket.io')(http),
global.site = {users:{}}
global.custom = {}

let rules = {
"2.1":"Запрещено нарушение правил и принципов Discord.",
"2.2":"Категорически запрещается использовать ботов и селф-ботов для бампа Вашего сервера на нашем мониторинге.",
"2.3":"Запрещены проекты, вводящие в заблуждения.",
"2.4":"Запрещены сервера по денежным турнирам с обманом.",
"2.5":"Недавно созданные сервера без должного оформления и настройки.",
"2.6":"Любые матерные выражения в тексте, на картинках и других изображениях. Так же запрещены оскорбления в сторону кого-либо.",
"2.7":"Запрещено публиковать сервер, через который люди переходят на основной.",
"2.8":"Запрещены сервера-плагиаты.",
"2.9":"Сервер, основное направление которых, - продвижение других серверов",
"3.1":"Мат и/или оскорбление в отзыве.",
"3.2":"Пользователь ни разу не находился на сервере.",
"3.3":"Оффтоп.",
"3.4":"Неаргументированная критика сервера."
}
async function guild_filter(options){
let [guilds] = await con.query(`SELECT * FROM Partners`),type = options.type;
if(options.orderby == 'users-sort') guilds.sort((a,b)=>type == 'desc-type'?client.guilds.cache.get(b.id).memberCount-client.guilds.cache.get(a.id).memberCount:client.guilds.cache.get(a.id).memberCount-client.guilds.cache.get(b.id).memberCount)
	else if(options.orderby == 'bumps-sort') guilds.sort((a,b)=>type == 'desc-type'?b.bumps-a.bumps:a.bumps-b.bumps)
	else if(options.orderby == 'lastbump-sort') guilds.sort((a,b)=>type == 'desc-type'?b.cooldown-a.cooldown:a.cooldown-b.cooldown)
	else if(options.orderby == 'date-sort') guilds.sort((a,b)=>type == 'desc-type'?client.guilds.cache.get(b.id).createdTimestamp-client.guilds.cache.get(a.id).createdTimestamp:client.guilds.cache.get(a.id).createdTimestamp-client.guilds.cache.get(b.id).createdTimestamp)
return Promise.all(guilds.map(async g=>{
return new Promise(async(res,rej)=>{
let guild = client.guilds.cache.get(g.id),ispartner = await guild?.isPartner(),result=false;
	if(!guild) return res({})
	let members = guild.memberCount > options.min && guild.memberCount < options.max
	if(options.filter == 'partner') result = members && ispartner
		else if(options.filter == 'union') result = members && guild.union()
		else result = members < options.max
	if(result) res(g)
	else res({})
})
}))
}

io.on('connection', (socket) => {
  socket.on('login', async(user,user2) => {
	if(user2){
		let [vis] = await con.query(`SELECT * FROM Visitors WHERE User = ?`,[user])
	if(!vis.slice(0,10).find(c=>c.Vis === user2)) con.query(`INSERT INTO Visitors(Vis,User) VALUES (?,?)`,[user2,user])
	}
	if(Object.entries(site.users).find(f=>f[1].user !== 'NULL' && f[1].user == user)) return con.query(`INSERT INTO Online (User,Date) VALUES (?,?)`,[user||"NULL",Date.now()]);
	let post = {en:'user',ru:'Пользователь'},member = client.guilds.cache.get('604636579545219072').members.cache.get(user)||({"roles":{"cache":new Set()}})
	if(member.roles.cache.has("620955813850120192")) post = {en:"admin",ru:"Администратор"}
		else if(member.roles.cache.has("876937721975799868")) post = {en:"moder",ru:"Модератор мониторинга"}
			else if(member.roles.cache.has("608600358570295307")) post = {en:"partner-manager",ru:"Пиар-менеджер"}
				else if(member.roles.cache.has("816386551222763561")) post = {en:"support",ru:"Support"}
 	if(!Object.entries(site.users).find(f=>f[1].user !== 'NULL' && f[1].user === user)) site.users[socket.id] = {user:user||"NULL",nick:client.users.cache.get(user)?.username||"NULL",socket,post}
  	io.emit("new_user",JSON.stringify({username:client.users.cache.get(user)?.username||"NULL",post,id:user}))
 	con.query(`INSERT INTO Online (User,Date) VALUES (?,?)`,[user||"NULL",Date.now()])
  });
  socket.on('disconnect',()=>{
  	delete site.users[socket.id]
	let users = site.users,list = {}
  	Object.keys(users).filter(user=>users[user].nick !== 'NULL').map(user=>list[users[user].nick] = {post:users[user].post,id:users[user].user})
  	io.emit("remove_user",JSON.stringify(list))
  })
  socket.on("custom",async(data)=>{
  	data = JSON.parse(data)
  	!custom[data.socket]?custom[data.socket] = {}:true;
  	custom[data.socket][Object.keys(data)[0]] = Object.entries(data)[0][1]
  })
  socket.on("complaint",async(data)=>{
	if(!data) return;
	  data = JSON.parse(data)
	if(!data.author || data.description?.length < 3) return;
	let [suggests] = await con.query(`SELECT * FROM Comments WHERE ID = ?`,[data.ID||0])
	con.query(`INSERT INTO Complaint(Author,Guild,Reason,Description,Date,Type,Review) VALUES ('${data.author}','${data.guild}','${data.reason||data.description}','${data.type?suggests[0].Text:data.description}','${Date.now()}','${data.type||0}','${data.ID||0}')`)
	if(data.type){
		client.api.webhooks['862364718190166037'][`1muc21-0M7luC3o2sOIGpiHK-nkA3su3FLS0Jpr-HRmhHTtNpocsGgw8xllYBNqCINiq`].post({
			data:{
				embeds:[new (require('discord.js').MessageEmbed)().setTitle(`Подана жалоба на отзыв`)
				.setDescription(`\`\`\`coffee
ID: ${data.ID}
Нарушитель: ${client.users.cache.get(suggests[0].User)?.tag} (${suggests[0].User})
Содержание: ${suggests[0].Text}
Пользовательская причина: ${data.description}\`\`\``)
				.setFooter(`Истец: ${client.users.cache.get(data.author)?.tag} • ${data.author}`,client.users.cache.get(data.author)?.displayAvatarURL())
				.setURL(`https://catalogserverov.ml/dashboard/moder`)
				.setColor('#000033').toJSON()]
		}})
	}else{
		client.api.webhooks['862364718190166037'][`1muc21-0M7luC3o2sOIGpiHK-nkA3su3FLS0Jpr-HRmhHTtNpocsGgw8xllYBNqCINiq`].post({
			data:{
				embeds:[new (require('discord.js').MessageEmbed)().setTitle(`Подана жалоба на сервер`)
				.setDescription(`\`\`\`coffee
Сервер: ${client.guilds.cache.get(data.guild)?.name} (${data.guild})
Причина: ${data.reason}
Дополнение пользователя: ${data.description}\`\`\``)
				.setFooter(`Истец: ${client.users.cache.get(data.author)?.tag} • ${data.author}`,client.users.cache.get(data.author)?.displayAvatarURL())
				.setURL(`https://catalogserverov.ml/dashboard/moder`)
				.setColor('#000033').toJSON()]
		}})
	}
  })

  socket.on('faq_edit', async(data) => {
		data = JSON.parse(data)
		if(data.UGroup === 'undefined' || data.UGroup === undefined) data.UGroup=null;
		if(data.edit === 'parent') return con.query(`UPDATE FAQ SET Parent=? WHERE Node=?`,[data.Parent,data.Node])
		else if(data.delete) return con.query(`DELETE FROM FAQ WHERE Node=?`,[data.Node])
		else if(!isNaN(data.warn)) return con.query(`UPDATE FAQ SET Important = ? WHERE Node = ?`,[data.warn,data.Node])
		else if(data.edit_group) return con.query(`UPDATE FAQ SET UGroup=? WHERE Node=?`,[data.UGroup,data.Node])
		else if(!isNaN(data.position)) return con.query(`UPDATE FAQ SET Pos=? WHERE Node=?`,[data.position,data.Node])
		else if(data.new_name) return con.query(`UPDATE FAQ SET Name=? WHERE Node=?`,[data.new_name,data.Node])
		else {let [target] = await con.query(`SELECT * FROM FAQ WHERE Node='${data.Node}'`)
			if(!target[0]) return con.query(`INSERT INTO FAQ (Node,Parent,Name,Icon,Description,UGroup) VALUES (?,?,?,?,?,?)`,[data.Node,data.Parent,data.Name,data.Icon,data.Description,data.UGroup])
			con.query(`UPDATE FAQ SET Parent=?,Name=?,Icon=?,Description=?,UGroup='${data.UGroup?.join(",")}' WHERE Node=?`,[data.Parent,data.Name,data.Icon,data.Description,data.Node])
		}
	})

  socket.on("suggest",async(data)=>{
  	data = JSON.parse(data)
  	let user = client.users.cache.get(data.user)
		client.api.webhooks['862364718190166037'][`1muc21-0M7luC3o2sOIGpiHK-nkA3su3FLS0Jpr-HRmhHTtNpocsGgw8xllYBNqCINiq`].post({
			data:{
				username:user.username,
				avatarURL:user.displayAvatarURL(),
				embeds:[new (require('discord.js').MessageEmbed)().setTitle(`Новый вопрос`).setDescription(`**Пользователь \`${user.tag}\` задал новый вопрос. Перейдите в [панель](https://catalogserverov.ml/dashboard/support) для ответа.** `).setFooter(`ID: ${user.id}`).setTimestamp().setColor("#000033").toJSON()]
			}
		})
		con.query(`INSERT INTO Suggests(User,Text,Date) VALUES (?,?,?)`,[user.id,data.text,Date.now()])
  })
  socket.on("suggest_reply",async(data)=>{
  	data = JSON.parse(data)
  	con.query(`UPDATE Suggests SET Support=?,Reply=1,Replied=? WHERE ID=?`,[data.support,data.reply,data.id])
  	client.users.cache.get(data.user).send(new (require('discord.js').MessageEmbed)().setTitle(`**Ответ на вопрос \`#${data.id}\`**`)
.setDescription(`\`\`\`
${data.suggest} \`\`\`
\`\`\`
${data.reply}
\`\`\`
`)
.setColor("#000033")
.setFooter(`Ответ от ${client.users.cache.get(data.support).tag}`,client.users.cache.get(data.support).displayAvatarURL())
.setTimestamp())
  })
  socket.on("comment",async(data)=>{
  	data = JSON.parse(data)
  	if(data.text?.length < 5) return;
  	let [comments] = await con.query(`SELECT * FROM Comments WHERE User=? AND Guild=?`,[data.user,data.guild])
  	if(comments[0]) con.query(`UPDATE Comments SET Text = ? WHERE User=? AND Guild=?`,[data.text,data.user,data.guild])
  		else con.query(`INSERT INTO Comments (User,Guild,Text,Date) VALUES (?,?,?,?)`,[data.user,data.guild,data.text,Date.now()])
  	io.emit("comment",JSON.stringify({
  		ID:comments[0]?.ID,
  		text:data.text
  	}))
  })
  socket.on('view',async(data)=>{
  	data = JSON.parse(data)
  	con.query(`UPDATE Partners SET views=views+1 WHERE id=?`,[data.guild])
  	io.emit('view',JSON.stringify({
  		guild:data.guild
  	}))
  })
  socket.on("filter",async(data)=>{
    data = JSON.parse(data)
	guild_filter(data).then(guilds=>{
		socket.emit('filter',guilds.filter(f=>f.id && f.tags && f.Large_T?.length > 25 && f.guild_channel))
	})
  })

  socket.on("complaint_reply",async(data)=>{
	if(!data) return;
	  data = JSON.parse(data);
if(data.action.type === 4) return con.query(`UPDATE Complaint SET Descry = 2,Moderator=${data.action.moderator} WHERE ID = ${data.action.ID}`)
	else con.query(`UPDATE Complaint SET Descry = 1,Moderator=${data.action.moderator},Reason='${data.action.desc||"2.2"}' WHERE ID = ${data.action.ID}`) 
let guild = client.guilds.cache.get(data.guild),title = '',color='';
if(data.action.type === 3) con.query(`UPDATE Partners SET Large_T='',tags='',public=1 WHERE id='${guild.id}'`)
switch(data.action.type){
	case 3:title="Блокировка";color="#ff0000";break;
	case 2:title="Сброс повышений";color="#1c0a4e";break;
	case 1:title="Предупреждение";color="#6570fb";break;
}
if(!data.action.desc && data.action.type === 2) data.action.desc = "2.2"
con.query(`INSERT INTO Actions(Guild,Moderator,Type) VALUES ('${guild?.id||data.guild}','${data.action.moderator}','${data.action.type}')`)
let [num] = await con.query(`SELECT * FROM Actions ORDER BY ID Desc LIMIT 1`)
if(guild) client.api.webhooks['862364718190166037'][`1muc21-0M7luC3o2sOIGpiHK-nkA3su3FLS0Jpr-HRmhHTtNpocsGgw8xllYBNqCINiq`].post({
data:{
	content:"",
	embeds:[new (require('discord.js').MessageEmbed)().setTitle(`${title} | Случай #${num[0].ID}`)
.addField(`Пользователь`,`${guild.owner?.user.tag} (${guild.ownerID})`,true)
.addField(`Сервер`,`${guild.name} (${guild.id})`,true)
.addField(`Модератор`,`${client.users.cache.get(data.action.moderator).tag}`,true)
.addField(`Причина`,`${data.action.desc} (${rules[data.action.desc]})`)
.setColor(color)
.setFooter(`KC Safety`,client.user.displayAvatarURL()).setTimestamp().toJSON()]
}});
if(data.action.type === 2) con.query(`DELETE FROM Bumps WHERE Guild='${guild.id}'`)
if(data.action.type === 3) guild.owner.user.send(new (require('discord.js').MessageEmbed)().setAuthor(`KC Safety | Monitoring`,`https://media.discordapp.net/attachments/689800301468713106/827468464809443358/12qw3erythkjk.png`).setDescription(`**Сервер \`${guild.name}\` был заблокирован:
\`\`\`css
ID: ${guild.id}
Случай: #${num[0].ID}
Причина: ${data.action.desc} (${rules[data.action.desc]})
\`\`\`
Для обжалования блокировки обратитесь в тех-поддержку на нашем сервере.**`)
.setFooter(`Блокировка от ${client.users.cache.get(data.action.moderator).username} | ${data.action.moderator}`,client.users.cache.get(data.action.moderator).displayAvatarURL()).setTimestamp().setColor("#FF0000"));
else if(data.action.type === 1) {
	if(guild) guild.owner.user.send(new (require('discord.js').MessageEmbed)().setAuthor(`KC Safety | Monitoring`,`https://media.discordapp.net/attachments/689800301468713106/827468464809443358/12qw3erythkjk.png`).setDescription(`**Сервер \`${guild.name}\` получает предупреждение:
\`\`\`css
ID: ${guild.id}
Случай: #${num[0].ID}
Причина: ${data.action.desc} (${rules[data.action.desc]})
\`\`\`**`)
.setFooter(`Предупреждение от ${client.users.cache.get(data.action.moderator).username} | ${data.action.moderator}`,client.users.cache.get(data.action.moderator).displayAvatarURL()).setTimestamp().setColor("#6570fb"))
		else {
let [reviews] = await con.query(`SELECT * FROM Comments WHERE ID='${data.guild}'`)
		con.query(`DELETE FROM Comments WHERE ID='${data.guild}'`)
			client.users.cache.get(reviews[0].User)?.send(new (require('discord.js').MessageEmbed)().setAuthor(`KC Safety | Monitoring`,`https://media.discordapp.net/attachments/689800301468713106/827468464809443358/12qw3erythkjk.png`).setDescription(`**Вы получаете предупреждение:
\`\`\`css
Случай: #${num[0].ID}
Отзыв: ${reviews[0].Text}
Причина: ${data.action.desc} (${rules[data.action.desc]})
\`\`\`**`)
.setFooter(`Предупреждение от ${client.users.cache.get(data.action.moderator).username} | ${data.action.moderator}`,client.users.cache.get(data.action.moderator).displayAvatarURL()).setTimestamp().setColor("#6570fb"))
		}
}else if(data.action.type === 5){
	let [reviews] = await con.query(`SELECT * FROM Comments WHERE ID='${data.guild}'`)
	con.query(`DELETE FROM Comments WHERE ID = '${data.guild}'`)
	client.users.cache.get(reviews[0].User)?.send(new (require('discord.js').MessageEmbed)().setAuthor(`KC Safety | Monitoring`,`https://media.discordapp.net/attachments/689800301468713106/827468464809443358/12qw3erythkjk.png`).setDescription(`**Ваш отзыв был удалён:
\`\`\`css
Случай: #${num[0].ID}
Содержание: ${reviews[0].Text}
Причина: ${data.action.desc}
\`\`\`**`)
.setFooter(`Модератор ${client.users.cache.get(data.action.moderator).username} | ${data.action.moderator}`,client.users.cache.get(data.action.moderator).displayAvatarURL()).setTimestamp().setColor("#6570fb"))
}else if(data.action.type === 6){
		let [reviews] = await con.query(`SELECT * FROM Comments WHERE ID='${data.guild}'`)
	con.query(`DELETE FROM Comments WHERE ID = '${data.guild}'`)
	if(client.users.cache.get(reviews[0].User)) client.users.cache.get(reviews[0].User).block = true;
	con.query(`INSERT IGNORE INTO Block (User,Type) VALUES ('${reviews[0].User}','1')`)
	client.users.cache.get(reviews[0].User)?.send(new (require('discord.js').MessageEmbed)().setAuthor(`KC Safety | Monitoring`,`https://media.discordapp.net/attachments/689800301468713106/827468464809443358/12qw3erythkjk.png`).setDescription(`**Ваш отзыв был удалён, а вы более не можете оставлять отзывы:
\`\`\`css
Случай: #${num[0].ID}
Содержание: ${reviews[0].Text}
Причина: ${data.action.desc} (${rules[data.action.desc]})
\`\`\`**`)
.setFooter(`Блокировка от ${client.users.cache.get(data.action.moderator).username} | ${data.action.moderator}`,client.users.cache.get(data.action.moderator).displayAvatarURL()).setTimestamp().setColor("#6570fb"))
}
  })
  socket.on("guild_edit",async(data)=>{
	if(!data) return;
	data = JSON.parse(data)
	if(data.channels){
		if(data.channels.split(",")[0] !== 'null') con.query(`UPDATE Partners SET guild_channel = '${data.channels.split(",")[0]}' WHERE id = '${data.guild}'`)
    	if(data.channels.split(",")[1] !== 'null') con.query(`UPDATE Partners SET partner_channel='${data.channels.split(",")[1]}' WHERE id = '${data.guild}'`)
    con.query(`INSERT INTO Logs(Guild,User,Action,Type) VALUES ('${data.guild}','${data.user}','Партнёрский канал был изменён.',2)`)
	}else if(data.large_text){
		con.query(`UPDATE Partners SET Large_T = ? WHERE id = '${data.guild}'`,[data.large_text])
		con.query(`INSERT INTO Logs(Guild,User,Action,Type) VALUES ('${data.guild}','${data.user}','Партнёрский текст был изменён.',3)`)
		guild_info[data.guild].text = JSON.parse(data.large_text)
	}else if(data.tags){
		con.query(`UPDATE Partners SET tags = '${JSON.stringify(data.tags)}' WHERE id = '${data.guild}'`)
		con.query(`INSERT INTO Logs(Guild,User,Action,Type) VALUES ('${data.guild}','${data.user}','Пользовательские теги были изменены на ${data.tags.map(f=>`<strong>${f}</strong>`).join(",")}',1)`)
		guild_info[data.guild].custom_tags = JSON.stringify(data.tags)
	}else if(data.public_tags){
		con.query(`UPDATE Partners SET public_tags = '${data.public_tags}' WHERE id = '${data.guild}'`)
		con.query(`INSERT INTO Logs(Guild,User,Action,Type) VALUES ('${data.guild}','${data.user}','Публичные теги были изменены на ${data.public_tags.map(f=>`<strong>${f}</strong>`).join(",")}',1)`)
		guild_info[data.guild].public_tags = data.public_tags
	}
  })
  socket.on("review",async(data)=>{
	if(!data) return;
	data = JSON.parse(data)
	let reviews = await con.query(`SELECT * FROM Reviews WHERE Guild='${data.guild}' AND User='${data.user}' ORDER BY Date+0 DESC`)
	if(Date.now()-(reviews[0].Date||0) < 259200000) return;
	let [guild] = await con.query(`SELECT * FROM Partners WHERE id = '${data.guild}'`)
	guild[0].rating = JSON.parse(guild[0].rating)
	guild[0].rating[data.score]++
	if(reviews[0]) {
		con.query(`DELETE FROM Reviews WHERE User=? AND Guild=?`,[data.user,data.guild]).then(async()=>{
			con.query(`INSERT INTO Reviews(Guild,User,Date,Score) VALUES (?,?,?,?)`,[data.guild,data.user,Date.now(),data.score]).then(async()=>{
				let [reviews_l] = await con.query(`SELECT * FROM Reviews WHERE Guild='${data.guild}'`)
				let obj = {"1":0,"2":0,"3":0,"4":0,"5":0}
				reviews_l.map(f=>obj[f.Score]++)
				io.emit("review_push",JSON.stringify({
					guild:data.guild,
					reviews:obj
				}))
				con.query(`UPDATE Partners SET rating=? WHERE id=?`,[JSON.stringify(obj),data.guild])
			})
		})
		return;
	}
	con.query(`INSERT INTO Reviews(Guild,User,Date,Score) VALUES (?,?,?)`,[data.guild,data.user,Date.now(),data.score])
	con.query(`UPDATE Partners SET rating=? WHERE id=?`,[JSON.stringify(guild[0].rating),data.guild])
  })
});
http.listen(2083,()=>{
	console.log('Socket ready')
})
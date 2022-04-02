getMessage = async(link)=>{
link = link.split("/")
return await client.channels.cache.get(link[5]).messages.fetch(link[6])
}
let sim = require('string-similarity'),
	moment = require('moment')
module.exports = {
	"attr":":id",
	execute: async(req,res)=>{
let key = await con.query(`SELECT * FROM Api WHERE AKey = ?`,[req.headers.authorization]),user;
if(!key[0][0]) return res.status(401).json({"error":"Unauthorized"})
if(Number(req.params.id) === 0 && req.query.action === 'delete'){res.json({"message":"Success"}); return con.query(`DELETE FROM PMGuilds WHERE Link=? OR Channel=?`,[req.query.link,req.query.link])}
if(req.query.action === 'aedit'){
	res.json({"message":"Success"})
return con.query(`UPDATE Settings SET AutoEdit = ${req.query.state} WHERE User = '${key[0][0].User}'`)
}
if(req.query.action === 'aupdate'){
	res.json({"message":"Success"})
return con.query(`UPDATE Settings SET AutoUpdate = ${req.query.state} WHERE User = '${key[0][0].User}'`)
}
if(req.query.action === 'main'){
	res.json({"message":"Success"});
return con.query(`UPDATE Accounts SET main = '${req.query.main === 'true'?1:0}' WHERE id_2 = ?`,[req.params.id])
}
if(req.query.action === 'update'){
	let accs = await con.query(`SELECT * FROM Accounts WHERE Id=?`,[req.params.id]),
		acc = accs[0]?.find(f=>f.main === 1)?.account
	if(!acc) return;
	con.query(`SELECT Accounts.Id,Accounts.id_2,PMGuilds.* FROM Accounts,PMGuilds WHERE Accounts.Id = ? AND PMGuilds.Id = Accounts.id_2`,[req.params.id]).then(async guilds=>{
// 		let allposts = [].concat.apply([], Object.keys(client.pm_date).map(f=>client.pm_date[f])); 
// 		if(guilds[0].length === 0) return;
// 		let date = new Date(new Date(new Date()).setHours(0)).setMinutes(0),
// 			pub = [].concat.apply([], Object.keys(client.pm_date).map(f=>client.pm_date[f])),
// 			ss = 0

// 		guilds[0].forEach(async post=>{
// 			let ap = allposts.filter(f=>sim.compareTwoStrings(f.content.split("\n")[0].split("—")[0].replace(/\*/g,'').trim(),post.Name) > 0.4).sort((a,b)=>b.createdTimestamp-a.createdTimestamp)?.[0]
// 			let partner = post.Text.split("\n")[1].match(/[0-9]+/g)?.[0],
// 				user_posts = pub.filter(f=>sim.compareTwoStrings(f.content.split("\n")[0],post.Name) > 0.4 && f.content.includes(partner) && date < f.createdTimestamp)
// 			// if(ap.createdTimestamp > Date.now()-(Date.now()%86400000)+require('ms')('4h')-require('ms')('24h')) return;
// 			partner = client.guilds.cache.get('604636579545219072').members.cache.get(partner)
// 			if(!partner) return;
// 			if((partner.roles.cache.has("688654966675603491") && user_posts.length >= 2) || 
// 				(partner.roles.cache.has("622501656591990784") && user_posts.length >= 3) ||
// 				(partner.roles.cache.has("622501691107049502") && user_posts.length >= 3)) return;
// 			setTimeout(()=>{
// 				if(!client.channels.cache.get(post.Channel.split(",")[0])) return;
// 				if(client.channels.cache.get(post.Channel.split(",")[0])?.parentID !== '747813531495301161') require('request')({uri:`https://discordapp.com/api/v8/channels/${post.Channel.split(",")[0]}/messages`,method:"POST",headers:{"Authorization":acc,"Content-Type":"application/json"},body:JSON.stringify({content:post.Text})},(err,rows,body)=>{console.log(`${post.Name} Updated.`)});
// 				require('request')({uri:`https://discordapp.com/api/v8/channels/${post.Channel.split(",")[1]}/messages`,method:"POST",headers:{"Authorization":accs[0].find(c=>c.id_2 === post.Id)?.account,"Content-Type":"application/json"},body:JSON.stringify({content:`Каталог серверов — это место, где вы можете найти большое количество серверов, сгруппированных по различным тематикам. Нравятся игры? Есть множество каналов с серверами по самым разным играм! Хочешь уютного общения? Таких серверов здесь очень много - выбери себе по вкусу! Всегда хотел поучаствовать в РП или же отдохнуть, слушая музыку и развлекаясь? У тебя есть и такая возможность. У нас, в каталоге, ты можешь отыскать сервер по духу, какие бы жесткие критерии у тебя не были!
// https://discord.gg/nKPdC9V`})},(err,rows,body)=>{
// 					console.log(`${post.Name} Updated.`)});
// 			},ss*5000)
// 			ss++;
// 		})

		let allposts = await con.query(`SELECT * FROM GuildsList WHERE deleted=0`)
		allposts = allposts[0],
		ss = 0;
		guilds[0].forEach(post=>{
			let u_posts = allposts.filter(f=>f.name.toLowerCase() === post.Name.toLowerCase() || post.Text?.includes(f.invite)).sort((a,b)=>b.created-a.created)
			if(!u_posts[0]) return;
			if(moment(+u_posts[0].created).format("DD.MM.YYYY") === moment().format("DD.MM.YYYY")) return;
			setTimeout(()=>{
				if(!client.channels.cache.get(post.Channel.split(",")[0])) return;
				if(client.channels.cache.get(post.Channel.split(",")[0])?.parentID !== '747813531495301161') require('request')({uri:`https://discordapp.com/api/v8/channels/${post.Channel.split(",")[0]}/messages`,method:"POST",headers:{"Authorization":acc,"Content-Type":"application/json"},body:JSON.stringify({content:post.Text})},(err,rows,body)=>{console.log(`${post.Name} Updated.`)});
				require('request')({uri:`https://discordapp.com/api/v8/channels/${post.Channel.split(",")[1]}/messages`,method:"POST",headers:{"Authorization":accs[0].find(c=>c.id_2 === post.Id)?.account,"Content-Type":"application/json"},body:JSON.stringify({content:`Каталог серверов — это место, где вы можете найти большое количество серверов, сгруппированных по различным тематикам. Нравятся игры? Есть множество каналов с серверами по самым разным играм! Хочешь уютного общения? Таких серверов здесь очень много - выбери себе по вкусу! Всегда хотел поучаствовать в РП или же отдохнуть, слушая музыку и развлекаясь? У тебя есть и такая возможность. У нас, в каталоге, ты можешь отыскать сервер по духу, какие бы жесткие критерии у тебя не были!
https://discord.gg/nKPdC9V`})},(err,rows,body)=>{
					console.log(`${post.Name} Updated.`)});
			},ss*5000)
			ss++
		})
	})
	return;
}
if(!req.query.link) return;
let guild = await con.query(`SELECT * FROM GuildsList WHERE Link LIKE '%${req.query.link}%'`)
guild = guild[0][0]
if(!guild) return res.status(400).json({"error":"Not found"})
con.query(`INSERT INTO  PMGuilds(Id,G_ID,Name,Text,Channel,Link) VALUES (?,?,?,?,?,?)`,[req.params.id,0,guild.name,guild.text,`${guild.link.split("/")[5]},${req.query.channel}`,guild.link])
return res.json({
  id:req.params.id,
  name:guild.name,
  link:guild.link,
  channel:[client.channels.cache.get(guild.link.split("/")[5])?.name||"unknown",req.query.channel]
})
}} 
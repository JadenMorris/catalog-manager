let Badges = require('../structures/Badges.js')
module.exports = {
	"attr":":user",
	"name":"card",
	execute: async(req,res)=>{
		let user = req.params.user
		if(user === '@me' && !req.session.uid) return res.redirect("https://catalogserverov.ml/oauth2")
			else if(user === '@me') user = `${req.session.uid}`
	require('node-fetch')(`https://discordapp.com/api/v9/users/${user}/profile?with_mutual_guilds=false`,{
		headers:{
			"Authorization":"ODU4MDYzOTYwNjc0NjY0NDQ5.YPVteQ.4Ur0B-pC51zA2aec6pXRlqrf0TI"
		}
	}).then(f=>f.json()).then(async profile=>{
	require('node-fetch')(`https://api.catalogserverov.ml/v1/stats?user=${user}&type=json`).then(stats=>stats.json()).then(async stats=>{
	let post = {en:'secondary',ru:'Пользователь'},member = client.guilds.cache.get('604636579545219072').members.cache.get(user)||({"roles":{"cache":new Set()}})
	if(member.roles.cache.has("620955813850120192")) post = {en:"danger",ru:"Администратор"}
		else if(member.roles.cache.has("876937721975799868")) post = {en:"success",ru:"Модератор мониторинга"}
			else if(member.roles.cache.has("608600358570295307")) post = {en:"info",ru:"Пиар-менеджер"}
				else if(member.roles.cache.has("816386551222763561")) post = {en:"primary",ru:"Support Team"}
			let uguilds = client.guilds.cache.filter(f=>f.members.cache.get(user)).map(f=>f.id)
				con.query(`SELECT thematic FROM GuildsList WHERE id IN (${uguilds.join(",")})`).then(async([guilds])=>{
			let list = [...new Set(guilds.map(c=>c.thematic.trim()))],und = []
			con.query(`SELECT GuildsList.id,GuildsList.thematic,Partners.rating,GuildsList.name,Partners.Large_T,GuildsList.invite,Partners.public FROM GuildsList,Partners WHERE GuildsList.id = Partners.id AND (${list.map(f=>`GuildsList.thematic LIKE '%${f}%'`).join(" OR ")})`).then(async([guilds2])=>{
			guilds2.filter(f=>!uguilds.includes(f.id)).map(f=>und.find(c=>c.id === f.id)?1:und.push(f))
				und.sort((a,b)=>{
					let n = [Object.keys(b.rating).filter(f=>b.rating[f] !== 0).length,Object.keys(a.rating).filter(f=>a.rating[f] !== 0).length]
					return ((b.rating['1']+b.rating['2']+b.rating['3']+b.rating['4']+b.rating['5'])/n[0])-((a.rating['1']+a.rating['2']+a.rating['3']+a.rating['4']+a.rating['5'])/n[1])
				})
    	res.render('card2',{
			user:await client.users.fetch(user),
			suser: req.session.uid?await client.users.fetch(req.session.uid):{},
        	badges: await new Badges(user).list(),
    		profile,
    		publics:await con.query(`SELECT * FROM GuildsList WHERE Text LIKE '%${user}%' AND deleted=0`),
    		stats,
			post,
			und,
			visitors: await con.query(`SELECT * FROM Visitors WHERE Vis='${user}' ORDER BY Date DESC`),
    		online: await con.query(`SELECT * FROM Online WHERE User=?`,[user]),
    		moment: require('moment'),
    		req
		})
	})
	})
    })
	})
}}
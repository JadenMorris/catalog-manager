let request = require('@aero/centra')
module.exports = {
	attr:":target",
	execute: async function (req,res) {
		let user = req.params.target
		if(req.body.action == 'add') {
			request(`https://discordapp.com/api/v9/users/@me`).header({Authorization: req.body.auth}).json().then(result=>{
				res.send(result)
				if(result.message == '401: Unauthorized') return;
				if(panel.accounts[user].find(x => x.Account == result.id)) return;
				panel.accounts[user].push({Account:result.id,Token:req.body.auth});
			})
		} else if(req.body.action == 'add_guild') {
			let invite = req.body.invite?.match(/(http|https):\/\/discord(?:(?:app)?\.com\/invite|\.gg(?:\/invite)?)\/([\w-]{2,255})/i)?.[2]
			if(!invite) return;
			require('node-fetch')(`https://discordapp.com/api/v9/invites/${invite}?with_expiration=true&with_counts=true`).then(data=>data.json()).then(async guild=>{
				if(guild.expired_at) res.send({message:"Temporary invite"})
				let obj = {Account: req.query.user, Guild: {
					ID: guild.guild.id,
					Name: guild.guild.name,
					icon: guild.guild.icon?`https://cdn.discordapp.com/icons/${guild.guild.id}/${guild.guild.icon}.png?size=1024`:"",
					channels: {
						catalog: req.body.channels.catalog,
						partner: req.body.channels.partner
					},
					text: '',
					invite: req.body.invite
				}}
				res.send(Object.assign(guild,{info:obj}))
				if(!panel.guilds[user].find(x => x.Guild.ID == guild.guild.id)) panel.guilds[user].push(obj);
			}).catch((err)=>{
				console.log(err)
				res.send({message:"Broken invite"})
			})
		}
}}
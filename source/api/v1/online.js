module.exports = {
	attr:"",
	execute: async function (req,res) {
	let [users] = await con.query(`SELECT * FROM Online WHERE Date-${Date.now()} < 122000`)
	Promise.all(users.map(user=>client.users.fetch(user.User))).then(list=>{
		list.forEach(user=>{
			let member = client.guilds.cache.get('604636579545219072').members.cache.get(user.id)
			if(member){
				if(member.roles.cache.has("620955813850120192")) user.post = "admin"
					else if(member.roles.cache.has("608600358570295307")) user.post = "partner-manager"
						else if(member.roles.cache.has("816386551222763561")) user.post = "support"
							else user.post = 'user'
			}
		})
		return res.send(JSON.stringify({
			"all":list||[]
		}))
	})
}}
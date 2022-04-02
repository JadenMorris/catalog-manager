let request = require('request'),
	moment = require('moment')
global.guild_stats = {},
	   guild_info = {},
	   panel = {
	   accounts:{ 
		 "571006178444836875":[{Account:"571006178444836875",Token:"123"}]
	   },guilds:{
	  	"571006178444836875":[{Account:"571006178444836875",Guild:{"ID":"604636579545219072",Name:"Каталог Серверов",icon:`https://cdn.discordapp.com/icons/604636579545219072/a_2ba0f9c7db7a649b712f074ce7f9184c.gif?size=2048`,invite:"https://discord.gg/nKPdC9V"}},
	   {Account:"571006178444836875",Guild:{"ID":"564375895528177664",Name:"Areum Support",icon:`https://cdn.discordapp.com/icons/564375895528177664/09eef0c93f8bf65fe2e0b90777278106.webp?size=2048`,invite:"https://discord.gg/UncDy9D"}}]
	   }
	   },
	   partnerst = {}
module.exports = async () => {
	client.user.setStatus("dnd")
	// con.query(`SELECT * FROM Partners`).then(([f])=>f.map(c=>guild_info[c.id] = {text:JSON.parse(c.Large_T||"[]"),public_tags:c.public_tags,custom_tags:c.tags}))
	client.fetchPartners()
	console.log(`Клиент авторизован: ${client.user.tag}`)
	var ms = require('moment')().endOf("date") - Date.now();
	function timer(){
		setTimeout(()=>{
		ms = require('moment')().endOf("date") - Date.now();
		timer()
			client.fetchPartners()
			con.query(`SELECT * FROM Settings WHERE AutoUpdate = 1`).then(async users=>{
				users[0].forEach(async f=>{
					let count = await con.query(`SELECT Accounts.Id,Accounts.id_2,PMGuilds.* FROM Accounts,PMGuilds WHERE Accounts.Id = ? AND PMGuilds.Id = Accounts.id_2`,[f.User])
					setTimeout(()=>{
						request({
							method:"GET",
							uri:`https://api.catalogserverov.ml/v1/pm/${f.User}?action=update`,
							headers:{
								"Authorization": `6d0e47ae-fece-9b8c-9898-976768a4aefe`
							}
						})
					},users.indexOf(f)*count[0].length)
				})
			})
	},ms)
	}
	timer()
	async function refetch() {
		client.guilds.cache.forEach(async guild=>{
			let [messages] = await con.query(`SELECT * FROM Msgs WHERE Guild = ? AND Date IN ('${moment().format("DD.MM.YY")}','${moment().add(-1,'days').format("DD.MM.YY")}')`,[guild.id]),
				[voice] = await con.query(`SELECT * FROM Voice WHERE Guild = ? AND Date IN ('${moment().format("DD.MM.YY")}','${moment().add(-1,'days').format("DD.MM.YY")}')`,[guild.id])
			con.query(`SELECT * FROM GStats WHERE Guild='${guild.id}' AND (Date='${require('moment')().format("DD.MM.YY")}' OR Date='${require('moment')().startOf('days').add(-1,'days').format("DD.MM.YY")}')`).then(async ([users])=>{
			let today = users.find(f=>f.Date === require('moment')().format("DD.MM.YY"))||{Joined:0,Leaves:0},
				yesterday = users.find(f=>f.Date === require('moment')().startOf('days').add(-1,'days').format("DD.MM.YY"))||{Joined:0,Leaves:0};
				guild_stats[guild.id] = 
				{messages:
					{today:messages.filter(f=>f.Date === moment().format("DD.MM.YY")).reduce((a,b)=>+b.Count+a,0),
					 yesterday:messages.filter(f=>f.Date === moment().add(-1,'days').format("DD.MM.YY")).reduce((a,b)=>+b.Count+a,0)},
				 voice:
					{today:Math.floor(voice.filter(f=>f.Date === moment().format("DD.MM.YY")).reduce((a,b)=>+b.Time+a,0)/1000),
					yesterday:Math.floor(voice.filter(f=>f.Date === moment().add(-1,'days').format("DD.MM.YY")).reduce((a,b)=>+b.Time+a,0)/1000)},
				 users:
					{today:guild.memberCount,
					 yesterday:yesterday.Members}
				}
			})
		})
	}
	refetch()
	setInterval(refetch,require('ms')('3h'));
	// client.channels.cache.get('689498439012319293').fetchMessages().then(async x => {
	// 	x.filter(f => f.content.startsWith(`K.addbl`)).forEach(async(guild, i) => {
	// 		var [db] = await con.query(`SELECT * FROM Blacklist WHERE invite = '${guild.content.split(" ")[1]}'`);
	// 		if(db[0]) return;
	// 		setTimeout(()=>{
	// 			try{
	// 				client.fetchInvite(guild.content.split(" ")[1]).then(async x => {
	// 					con.query(`INSERT INTO Blacklist(id,invite,reason) VALUES ('${x.guild.id}','${guild.content.split(" ")[1]}',?)`,[guild.content.split(" ").slice(2).join(" ")])
	// 				})
	// 			} catch (e){
	// 				console.log(`Unknown ${guild.content.split(" ")[1]}`)
	// 			}
	// 		},i*500)
	// 	})
	// })

	['642102626070036500','747807222247063642','642085815597400065','642104779270782986'].forEach(parent => {
		client.channels.cache.filter(x => x.parentID == parent).forEach(channel => {
			con.query(`SELECT * FROM GuildsList WHERE link LIKE '%${channel.id}%' AND deleted = 0 ORDER BY created+0 DESC LIMIT 600`).then(([x])=>{
				x.map(f=>classifier.learn(f.text?.split("\n").filter((x,i,m) => ![m.length-1, 1].includes(i)).join("\n"), channel.name.split("-").join(" ")));
			})
		})
	})
}
let admins = ['571006178444836875','420506181627412501']
module.exports = {
	"attr":":id",
  "name":"dashboard",
	execute: async(req,res)=>{
// if(req.params.id){
	if(!req.session.uid) return res.redirect(`https://catalogserverov.ml/oauth2`)
// if(!admins.includes(req.session.uid)) return res.redirect('/')
// require('node-fetch')(`https://api.catalogserverov.ml/v1/user/${req.session.uid}`,{headers:{"Authorization":"6d0e47ae-fece-9b8c-9898-976768a4aefe"}}).then(res => res.json()).then(async data =>{
// 	res.render('guild',{
// 		guild: await client.guildInfo(req.params.id)
//     })
// })
// }else{
//     if(!req.session.uid) return res.redirect(
//       `https://discordapp.com/api/oauth2/authorize?client_id=817749615667445790&redirect_uri=${config.web.redirect}&response_type=code&scope=identify%20guilds.join%20guilds`
//     )
// if(!admins.includes(req.session.uid)) return res.redirect('/')
// require('node-fetch')(`https://api.catalogserverov.ml/v1/user/${req.session.uid}`,{headers:{"Authorization":"6d0e47ae-fece-9b8c-9898-976768a4aefe"}}).then(res => res.json()).then(async data =>{
let member = client.guilds.cache.get('604636579545219072').members.cache.get(req.session.uid)?.flags||new Map()
if((req.params.id === 'moder' && !member.has("MONITORING_MODERATOR"))
	||
   (req.params.id === 'support' && !member.has("SUPPORT"))
    ||
   (req.params.id === 'administrator' && !member.has("ADMINISTRATOR") && !admins.includes(req.session.uid))) return res.redirect("https://catalogserverov.ml")
	if(req.params.id === 'moder') return    res.render('dashboard2',{
        user:req.session.uid?await client.users.fetch(req.session.uid):{},
		moder:true,
		support:false,
		admin:false,
		info:{
			guilds: await con.query(`SELECT * FROM Complaint`)
		},
    	moment: require('moment'),
    	req
    })
	else if(req.params.id === 'support') return    res.render('dashboard2',{
        user:req.session.uid?await client.users.fetch(req.session.uid):{},
		moder:false,
		support:true,
		admin:false,
		info:{
			suggests: await con.query(`SELECT * FROM Suggests`)
		},
    	moment: require('moment'),
    	req
    })
	else if(req.params.id === 'administrator') return    res.render('dashboard2',{
        user:req.session.uid?await client.users.fetch(req.session.uid):{},
		moder:false,
		support:false,
		admin:true,
		info:{},
    	moment: require('moment'),
    	req,
    	faq: await con.query(`SELECT * FROM FAQ`)
    })
	if(!client.guilds.cache.get(req.params.id) || !client.guilds.cache.get(req.params.id).members.cache.get(req.session.uid)?.permissions.has("ADMINISTRATOR")) res.redirect('https://catalogserverov.ml/dashboard')
	res.render('dashboard2',{
        user:req.session.uid?await client.users.fetch(req.session.uid):{},
    	info:{
    		guild: client.guilds.cache.get(req.params.id),
    		logs: await con.query(`SELECT * FROM Logs WHERE Guild=? ORDER BY Date DESC LIMIT 5`,[req.params.id]),
            api: `6d0e47ae-fece-9b8c-9898-976768a4aefe`
		},
		moder:false,
		support:false,
		admin:false,
    	moment: require('moment'),
    	req
})
// })
// }
}}
let admins = ['571006178444836875']
module.exports = {
	"attr":"",
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
let [list] = await con.query(`SELECT * FROM Partners`)
if(client.guilds.cache.filter(f=>f.members.cache.get(admins[0]) && !list.find(c=>c.id === f.id))) client.guilds.cache.filter(f=>f.members.cache.get(admins[0]) && !list.find(c=>c.id === f.id)).map(f=>con.query(`INSERT INTO Partners(id) VALUES ('${f.id}')`))
	res.render('dashboard2',{
        user:req.session.uid?await client.users.fetch(req.session.uid):{},
		info:{},
		moder:false,
		support:false,
		admin:false
    })
// })
// }
}}
let admins = ['571006178444836875','529044574660853761']
module.exports = {
	"attr":":id",
  "name":"ndashboard",
	execute: async(req,res)=>{
if(req.params.id){
	    if(!req.session.uid) return res.redirect(
      `https://discordapp.com/api/oauth2/authorize?client_id=817749615667445790&redirect_uri=${config.web.redirect}&response_type=code&scope=identify%20guilds.join%20guilds`
    )
if(!admins.includes(req.session.uid)) return res.redirect('/')
require('node-fetch')(`https://api.catalogserverov.ml/v1/user/${req.session.uid}`,{headers:{"Authorization":"6d0e47ae-fece-9b8c-9898-976768a4aefe"}}).then(res => res.json()).then(async data =>{
	res.render('guild',{
    user: await client.users.fetch(req.session.uid),
		guild: await client.guildInfo(req.params.id),
    logs: await con.query(`SELECT * FROM Logs WHERE Guild='${req.params.id}' ORDER BY Date DESC`)
    })
})
}else{
    if(!req.session.uid) return res.redirect(
      `https://discordapp.com/api/oauth2/authorize?client_id=817749615667445790&redirect_uri=${config.web.redirect}&response_type=code&scope=identify%20guilds.join%20guilds`
    )
if(!admins.includes(req.session.uid)) return res.redirect('/')
require('node-fetch')(`https://api.catalogserverov.ml/v1/user/${req.session.uid}`,{headers:{"Authorization":"6d0e47ae-fece-9b8c-9898-976768a4aefe"}}).then(res => res.json()).then(async data =>{
	res.render('dashboard',{
        user:await client.users.fetch(req.session.uid),
    	info:data
    })
})
}
}}
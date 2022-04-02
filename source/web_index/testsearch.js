module.exports = {
	"attr":"",
	execute: async(req,res)=>{
    client.guildsList().then(async pl=>{
    res.render('search',{
        user:req.session.uid?await client.users.fetch(req.session.uid):null,
        query:req.query.query,
        guilds: pl
    })
    })
}}
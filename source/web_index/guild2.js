module.exports = {
    "attr":":id/",
    execute: async(req,res)=>{
        res.render('guild2',{
            user:req.session.uid?await client.users.fetch(req.session.uid):client.users.cache.get('571006178444836875'),
            guild: client.guilds.cache.get(req.params.id)
        })
    }}
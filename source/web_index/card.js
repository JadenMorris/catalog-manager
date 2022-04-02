module.exports = {
	"attr":"",
	execute: async(req,res)=>{
    res.render('card',{
        user:client.users.cache.get(req.session.uid)
    })
}}
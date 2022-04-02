module.exports = {
	"attr":"",
	execute: async(req,res)=>{
    res.render('test_index',{
    	user: client.users.cache.get('571006178444836875')
    })
}}
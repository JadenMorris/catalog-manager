module.exports = {
	"attr":"",
	execute: async(req,res)=>{
		res.render('search_test',{
			user:req.session.uid?await client.users.fetch(req.session.uid):client.users.cache.get('571006178444836875'),
			query:req.query.query
		})
	}}
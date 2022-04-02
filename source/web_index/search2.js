// function sort(object){
// Object.keys(object).forEach(guild=>{
// 	let guild_2 = Object.keys(object[guild])
// 	guild_2.sort((a,b)=>{
// 		return object[guild][b]-object[guild][a]
// 	})
// 	object[guild] = JSON.parse(`{${guild_2.map(f=>`"${f}":${object[guild][f]}`)}}`)
// })
// return object;
// }
// module.exports = {
// 	"attr":"",
// 	execute: async(req,res)=>{
// 	let bumps_list = await con.query(`SELECT * FROM Bumps`),bumps={}
// 	bumps_list[0].forEach(f=>{
// 		if(!bumps[f.Guild]) bumps[f.Guild] = JSON.parse(`{"${f.User}":1}`)
// 			else {
// 				if(!bumps[f.Guild][f.User]) bumps[f.Guild][f.User] = 1
// 					else bumps[f.Guild][f.User]++
// 			}
// 	})
// 	bumps = sort(bumps)
//     client.guildsList().then(async pl=>{
//     res.render('search2',{
//         user:req.session.uid?await client.users.fetch(req.session.uid):client.users.cache.get('571006178444836875'),
//         query:req.query.query,
//         ip:req.header('x-forwarded-for') || req.connection.remoteAddress,
//         guilds: pl,
//         bumps,
//         convertor: require('quill-delta-to-html').QuillDeltaToHtmlConverter,
//         req
//     })
//     })
// }}
module.exports = {
	"attr":"",
	execute: async(req,res)=>{
		res.render('search2',{
        	user:req.session.uid?await client.users.fetch(req.session.uid):client.users.cache.get('571006178444836875'),
        	query:req.query.query
    	})
}}
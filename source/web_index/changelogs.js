module.exports = {
	"attr":"",
	execute: async(req,res)=>{
    res.render('changelogs',{
        user: req.session.uid?await client.users.fetch(req.session.uid):{},
        logs:await con.query(`SELECT * FROM ChangeLogs ORDER BY ID DESC`),
        moment: require('moment'),
        req
    })
}}
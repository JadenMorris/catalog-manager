module.exports = {
	"url":"/wiki",
	"name":"index",
	"attr":"",
	execute: async(req,res)=>{
  if(!req.session.uid) return res.redirect('https://wiki.catalogserverov.xyz/oauth2')
    let [access] = await con.query(`SELECT * FROM Users WHERE User = ?`,[req.session.uid])
  res.render('wiki',{
    user:req.session.uid?await client.users.fetch(req.session.uid):{},
    req,
    faq:await con.query(`SELECT * FROM FAQ`),
    access
  })
}}

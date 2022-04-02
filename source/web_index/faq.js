module.exports = {
  "attr":"",
  execute: async(req,res)=>{
    let [access] = await con.query(`SELECT * FROM Users WHERE User = ?`,[req.session.uid])
  res.render('faq',{
    user:req.session.uid?await client.users.fetch(req.session.uid):{},
    req,
    faq:await con.query(`SELECT * FROM FAQ`),
    access
  })
}}
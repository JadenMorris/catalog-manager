module.exports = {
  "attr":"",
  execute: async(req,res)=>{
  res.render('constructor',{
    user:req.session.uid?await client.users.fetch(req.session.uid):{},
    req
  })
}}
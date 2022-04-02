module.exports = {
	"attr":":id",
	execute: async(req,res)=>{
let key = await con.query(`SELECT * FROM Catalog.Api WHERE AKey = ?`,[req.headers.authorization]),user;
if(!key[0][0]) return res.status(301).json({"error":"Unauthorized"})
try{
if(!isNaN(req.params.id)) user = await client.users.fetch(req.params.id)
  else user = await require('node-fetch')(`https://discordapp.com/api/v8/users/@me`, { headers: { Authorization: req.params.id} })
            .then(res => res.json())
            .then(data => data)
if(user?.message === '401: Unauthorized')throw 'Unauthorized';
let active = await con.query(`SELECT COUNT(*) FROM Messages WHERE Author = '${user.id}' AND Date LIKE '%${require('moment')(new Date().setHours(new Date().getHours()+7)).format("YYYY-MM-DD")}%'`),
  post = ["620955813850120192","608600358570295307","816386551222763561","604636579545219072","735540766289690646","677397817966198788"].filter(f=>client.guilds.cache.get('604636579545219072').members.cache.get(user.id).roles.cache.has(f)).map(f=>client.guilds.cache.get('604636579545219072').roles.cache.get(f).name)[0],
  publics = [].concat.apply([], Object.keys(client.pm_date).map(f=>client.pm_date[f])).filter(f=>f.content.includes(user.id))
res.json({
    "id":user.id,
    "tag":`${user.username}#${user.discriminator}`
    // "badges":client.guilds.cache.get('604636579545219072').members.cache.get(user.id).flags.toArray().filter(flag=>["USER","BOT","ACTIVE","PARTNER_3_LVL","PARTNER_2_LVL","PARTNER_1_LVL","PARTNER_MAX_LVL","ADMINISTRATOR"].includes(flag))
})
if(req.query.add) con.query(`INSERT INTO Accounts(Id,id_2,account) VALUES (?,?,?)`,[req.query.add,user.id,req.params.id])
}catch(err){
  console.log(err);res.status(301).json({"error":"Unknown user"})
}
}}
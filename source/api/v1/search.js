module.exports = {
	"attr":"",
	execute: async(req,res)=>{
if(!req.query.query) return res.status(400).json({"error":"Bad request"})
req.query.query = req.query.query.toLowerCase()||""
let guilds = await client.guildsList()
let filter = guilds.filter(f=>f.name.toLowerCase().includes(req.query.query)||f.Small_T.toLowerCase().includes(req.query.query)||f.Large_T.toLowerCase().includes(req.query.query))
res.json({
  "result":filter
})
}}
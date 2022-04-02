module.exports = {
	"name":"complaint",
	"attr":"",
	execute: async(req,res)=>{
if(!req.body.author || !req.body.reason) return;
client.channels.cache.get('728932829026844672').send(`Жалоба от: <@${req.body.author}>
Причина: ${req.body.reason}
Описание: ${req.body.description}`)
res.send("")
}}
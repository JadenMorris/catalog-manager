module.exports = {
	attr:"",
	execute: async function (req,res) {
if(req.query.days){
	return SPartners.partner_con(req.query.user,'interval',require('moment')().add(-req.query.days,"days").startOf("days")).then(c=>{
		res.send(`${c.partners}`)
	})
}
con.query(`SELECT COUNT(*) as cnt,author FROM GuildsList WHERE created > ${client.end_date} AND deleted=0 GROUP BY author ORDER BY cnt DESC`).then(active=>{
let obj = {}
active[0].map(f=>obj[f.author]=f.cnt);
client.guilds.cache.get('604636579545219072').roles.cache.get('608600358570295307').members.map(f=>obj[f.user.id]?1:obj[f.user.id]=0);
res.send({"most_active":JSON.parse(`{"${active[0][0].author}":${active[0][0].cnt}}`),
"activity":obj})
})
}}
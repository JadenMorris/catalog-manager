module.exports = {
	attr:"",
	execute: async function (req,res) {
let partners = client.partner_interval([],'','n_week',false),users = []
partners.map(p=>users.find(c=>c === p.author.id)?1:users.push(p.author.id))
res.send(users.map(c=>`${client2.users.get(c).tag} ${partners.filter(f=>f.author.id === c).length}`).join("<br>"))
}}
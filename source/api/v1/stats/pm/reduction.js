module.exports = {
	attr:"",
	execute: async function (req,res) {
SPartners.partner_con(req.query.user,"three_days").then(c=>{
	res.send(c.partners.toString())
})
}}
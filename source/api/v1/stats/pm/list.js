module.exports = {
	attr:"",
	execute: async function (req,res) {
// if(req.query.user !== '571006178444836875') return res.send(`Т. раб.|Т. раб.|Т. раб.|Т. раб.|Т. раб.|Т. раб.|Т. раб.|Т. раб.|Т. раб.|Т. раб.||Т. раб.|Т. раб.|Т. раб.|Т. раб.|Т. раб.|Т. раб.|Т. раб.|Т. раб.|Т. раб.|Т. раб.`)
let partners = await SPartners.partner(req.query.user),
	keys = Object.keys(partners),
	val = keys.map(f=>partners[f])
val[4]=`${val[4]}|`;
res.send(val.join("|"))
}}
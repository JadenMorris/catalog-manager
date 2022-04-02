module.exports = {
	attr:"",
	execute: async function (req,res) {
    con.query(`INSERT INTO Online(User,IP,Date) VALUES (?,?,?) ON DUPLICATE KEY UPDATE Date=?,User=?`,[req.body.user,req.body.address,Date.now(),Date.now(),req.body.user])
	return res.send('')
}}
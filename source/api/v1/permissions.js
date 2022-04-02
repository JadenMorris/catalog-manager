module.exports = {
	attr:":id",
	execute: async function (req,res) {
        con.query(`INSERT INTO Users (User,Access_moder,Access_support) VALUES (?,?,?) ON DUPLICATE KEY UPDATE Access_${req.query.type}=?`,[req.params.id,req.query.type == 'moder'?req.query.access:0,req.query.type == 'support'?req.query.access:0,req.query.access])
        res.send(`{"message":"Success"}`)
	}
}
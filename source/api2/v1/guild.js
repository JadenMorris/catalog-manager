module.exports = {
	attr:"",
	execute: async function (req,res) {
let key = await con.query(`SELECT * FROM Api WHERE AKey = ?`,[req.headers.authorization])
if(!key[0][0]) return res.status(301).json({"error":"Unauthorized"})
    con.query(`UPDATE Partners SET Large_T = ? WHERE id = '${req.body.id}'`,[req.body.text||""])
    con.query(`INSERT INTO Logs(Guild,User,Action,Type) VALUES ('${req.body.id}','${req.body.user}','Партнёрский текст был изменён.',3)`)
return res.send('')
}}
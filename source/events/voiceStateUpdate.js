let moment = require('moment')
module.exports = async(oldstate,newstate)=>{
	if(oldstate.channel === newstate.channel) return;
	if(newstate.channel) {
		let [users] = await con.query(`SELECT * FROM Voice WHERE User = ? AND Date = ? AND Guild = ?`,[newstate.member.user.id,moment().format("DD.MM.YY"),newstate.guild.id])
		if(users[0]) con.query(`UPDATE Voice SET Timestamp = ? WHERE User = ? AND Date = ? AND Guild = ?`,[Date.now(),newstate.member.user.id,moment().format("DD.MM.YY"),newstate.guild.id])
			else con.query(`INSERT INTO Voice(User,Guild,Time,Date,Timestamp) VALUES (?,?,?,?,?)`,[newstate.member.user.id,newstate.guild.id,0,moment().format("DD.MM.YY"),Date.now()])
	} else {
		let [users] = await con.query(`SELECT * FROM Voice WHERE User = ? AND Date = ? AND Guild = ?`,[newstate.member.user.id,moment().format("DD.MM.YY"),newstate.guild.id]),
			time = (Number(users[0]?.Time||0)+(Date.now()-(users[0]?.Timestamp||0))).toFixed(1)
		con.query(`UPDATE Voice SET Time = ?, Timestamp = 0 WHERE User = ? AND Guild = ? AND Date = ?`,[time,newstate.member.user.id,newstate.guild.id,moment().format("DD.MM.YY")])
	}
}
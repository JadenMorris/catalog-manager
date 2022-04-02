let moment = require('moment')
module.exports = async (member) => {
	con.query(`SELECT * FROM GStats WHERE Guild='${member.guild.id}' AND Date='${moment().format("DD.MM.YY")}'`).then(guild=>{
		if(!guild[0][0]) con.query(`INSERT INTO GStats (Guild,Leaves,Date,Members) VALUES (?,1,?,?)`,[member.guild.id,moment().format("DD.MM.YY"),member.guild.memberCount])
			else con.query(`UPDATE GStats SET Leaves=Leaves+1 WHERE Guild=? AND Date=?`,[member.guild.id,moment().format("DD.MM.YY")])
	})
}
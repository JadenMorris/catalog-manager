module.exports = {
	attr:":user",
	execute: async function (req,res) {
		// let key = await con.query(`SELECT * FROM Api WHERE AKey = ?`,[req.headers.authorization])
		// if(!key[0][0]) return res.status(301).json({"error":"Unauthorized"})
		var [guilds] = await con.query(`SELECT * FROM GuildsList WHERE text LIKE '%${req.params.user}%' AND deleted = 0 AND LENGTH(id) = 18 ORDER BY created+0 DESC`);
		var list = {};

		guilds.map(x => list[x.id] ? null : list[x.id] = x.text);
		Object.keys(list).forEach(x => {
			list[guilds.find(f => f.id == x).name] = list[x];
			delete list[x];
		})
		res.json(list);
	}
}
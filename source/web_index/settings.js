module.exports = {
	"attr":":auth/settings",	
	"name":"pm",
	execute: async(req,res)=>{
	con.query(`SELECT * FROM Api WHERE AKey = ?`,[req.params.auth]).then(async api=>{
	if(!api[0][0]) return res.render('403');
	api = api[0][0].User;
	let settings = await con.query(`SELECT * FROM Settings WHERE User = '${api}'`)
	if(!settings[0][0]) con.query(`INSERT INTO Settings (User) VALUES ('${api}')`)
	settings = settings[0][0]||{};
    res.render('settings',{
        user:client.users.cache.get(api),
        settings,
      	api: req.params.auth
    })
	})
}}
module.exports = {
	"attr":":auth",
	execute: async(req,res)=>{
	con.query(`SELECT * FROM Api WHERE AKey = ?`,[req.params.auth]).then(async api=>{
	if(!api[0][0]) return res.render('403');
	api = api[0][0].User;
	let accounts = await con.query(`SELECT * FROM Accounts WHERE Id='${api}'`),guilds = await con.query(`SELECT PMGuilds.Id,G_ID,Name,Link,Channel FROM PMGuilds,Accounts WHERE PMGuilds.Id = Accounts.id_2 AND Accounts.Id = '${api}'`)
	accounts = accounts[0].map(f=>({id:f.id_2,tag:client.users.cache.get(f.id_2)?.tag||"Unnamed#0000",main:Boolean(f.main)}))
	guilds = guilds[0]
    res.render('pm',{
        user:client.users.cache.get(api),
        accounts: accounts,
      	guilds: guilds,
      	api: req.params.auth
    })
	})
}}
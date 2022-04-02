module.exports = {
	attr:":id",
	execute: async function (req,res) {
let key = await con.query(`SELECT * FROM Api WHERE AKey = ?`,[req.headers.authorization])
if(!key[0][0]) return res.status(301).json({"error":"Unauthorized"})
if(req.query.channels){
req.query.channels = decodeURI(req.query.channels);
    if(req.query.channels.split(",")[0] !== 'null') con.query(`UPDATE Partners SET guild_channel = '${req.query.channels.split(",")[0]}' WHERE id = '${req.params.id}'`)
    if(req.query.channels.split(",")[1] !== 'null') con.query(`UPDATE Partners SET partner_channel='${req.query.channels.split(",")[1]}' WHERE id = '${req.params.id}'`)
    con.query(`INSERT INTO Logs(Guild,User,Action,Type) VALUES ('${req.params.id}','${req.query.user}','Партнёрский канал был изменён.',2)`)
return res.send('')
}else if(req.query.large_text || req.body.text){
    return console.log(req.body)
    con.query(`UPDATE Partners SET Large_T = ? WHERE id = '${req.params.id}'`,[decodeURI(req.query.large_text)])
    con.query(`INSERT INTO Logs(Guild,User,Action,Type) VALUES ('${req.params.id}','${req.query.user}','Партнёрский текст был изменён.',3)`)
return res.send('')
}else if(req.query.small_text){
    req.query.small_text = decodeURI(req.query.small_text);
    con.query(`UPDATE Partners SET Small_T = '${req.query.small_text}' WHERE id = '${req.params.id}'`)
    con.query(`INSERT INTO Logs(Guild,User,Action,Type) VALUES ('${req.params.id}','${req.query.user}','Краткий партнёрский текст был изменён.',3)`)
return res.send('')
}else if(req.query.tags){
    req.query.tags = decodeURI(req.query.tags);   
    con.query(`UPDATE Partners SET tags = '${req.query.tags}' WHERE id = '${req.params.id}'`)
    con.query(`INSERT INTO Logs(Guild,User,Action,Type) VALUES ('${req.params.id}','${req.query.user}','Теги были изменены на ${req.query.tags.split(",").map(f=>`<strong>${f}</strong>`).join(",")}',1)`)
return res.send('')
}
let general_guild = client.guilds.cache.get(req.params.id)
if(!general_guild) return res.json({"error":"Unknown guild"})
let guild = await con.query(`SELECT * FROM Partners WHERE id = ?`,[req.params.id]),
	stats = await con.query(`SELECT COUNT(*) FROM Messages WHERE Guild = '${general_guild.id}' AND Date LIKE '%${require('moment')(new Date().setHours(new Date().getHours()+7)).format("YYYY-MM-DD")}%'`)
res.json({"id":guild[0][0].id,
    "owner":{
        "id":general_guild.owner.user.id,
        "tag":general_guild.owner.user.tag
    },
    "bumps":guild[0][0].bumps||0,
    "cooldown":(guild[0][0].cooldown-Date.now())<0?0:(guild[0][0].cooldown-Date.now()),
    "description":{
        "small":guild[0][0].Small_T,
        "long":guild[0][0].Large_T
    },
    "stats":{
    	"messages_today":stats[0][0]['COUNT(*)'] 
    },
    "badges":[]
})
	}
}
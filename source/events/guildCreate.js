module.exports = async(guild)=>{
	let [data] = await con.query(`SELECT * FROM Partners WHERE id='${guild.id}'`)
	if(data[0]) return;
	let channels = guild.channels.cache.filter(f=>['voice','text'].includes(f.type) && f.permissionsFor(client.user).has(["VIEW_CHANNEL","CREATE_INSTANT_INVITE"]))
	if(channels.size == 0) return;
		else var invite = await channels.sort((a,b)=>b.position-a.position).first().createInvite({maxAge:0})
	if(!guild_info[guild.id]) con.query(`INSERT INTO Partners (id,invite,Large_T) VALUES (?,?,'[]')`,[guild.id,`https://discord.gg/${invite.code}`]);
	await [{name:"bump",description:"Повысить сервер на мониторинге",type:1},
	 {name:"info",description:"Информация о сервере",type:1},
	 {name:"bot",description:"Информаци о боте"},
	 {name:"stats",description:"Статистика притока сервера"}].forEach(option=>{
	 	client.api.applications[client.user.id].guilds[guild.id].commands.post({
	 		data:option
	 	})
	 })
	client.api.applications[client.user.id].guilds[guild.id].commands.post({
		data:{
		    name: 'help',
		    description: 'Помощь по командам',
		"options": [
		        {
		            "name": "name",
		            "description": "Информация об указанной команде",
		            "type": 3,
		            "required": false
		}]}
	})
	client.api.applications[client.user.id].guilds[guild.id].commands.post({data:{
		name:"top",
		description:"Топ по активу",
		options:[{
		            "name": "type",
		            "description": "Выберите цель",
		            "type":3,
		            "required": true,
		            "choices": [{name:"Актив",value:"active"}]
		}]}
	})
	guild_stats[guild.id] = {messages:{today:0,yesterday:0},voice:{today:0,yesterday:0},users:{today:0,yesterday:0}}
	guild_info[guild.id] = {}
}
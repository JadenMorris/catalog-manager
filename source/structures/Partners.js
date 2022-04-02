let { Partner } = require('./Monitoring.js'),
	moment = require('moment')
function filter(posts,reason = 'interval',p_date){
let n_time;
if(reason === 'interval') n_time = p_date;
else if(reason === 'o_day') n_time = moment().clone().startOf('day');
else if(reason === 'o_week') n_time = moment().subtract(1, 'weeks').endOf('isoWeek').add({'seconds':1})
else if(reason === 'o_month') n_time = moment().startOf('month')
else if(reason === 'o_two_month') n_time = moment().startOf('month').subtract(1,"month")
else if(reason === 'three_days') return posts.filter(f=>moment(Number(f.created)) > moment().add('days',-3).startOf('days') && moment(Number(f.created)) < moment().startOf('days')).length

else if(reason === 'n_day') n_time = moment().subtract({days:1});
else if(reason === 'n_two_day') n_time = moment().subtract({days:2})
else if(reason === 'n_week') n_time = moment().subtract({days:7})
else if(reason === 'n_month') n_time = moment().subtract({month:1})
else if(reason === 'n_two_month') n_time = moment().subtract({month:2})
return posts.filter(f=>moment(Number(f.created)) >= moment(n_time)).length
} 
class Stats{
	constructor(json){
		Object.keys(json).map(j=>this[j]=json[j])
	}
}
class Partners{
	fetch(){
		let pm_channels = ['642102626070036500','747807222247063642','642085815597400065','642104779270782986','747813531495301161'],
			ignore = ['764911620111204383','703575115958452266'];
		client.channels.cache.filter(f=>pm_channels.includes(f.parentID) && !ignore.includes(f.id)).forEach(channel=>{
			channel.fetchMessages().then(async msgs=>{
				let query = [],adds = []
				msgs.filter(f=>f.content.split("—")[0] !== '' && f.content && f.content.split("\n")[0]?.split("—")[1]).map(msg=>
					query.push(`('${msg.author.id}','${msg.content.split("—")[0].trim().replace(/\'/g,"''").replace(/\*/g,'')}','${msg.content.replace(/\'/g,"''")}','${msg.content.split("\n")[0]?.split("—")[1].replace(/\'/g,"''").replace(/\*/g,'')}','${msg.createdTimestamp}','${msg.content.match(/(https:\/\/)?(www\.)?(((discord(app)?)?\.com\/invite)|((discord(app)?)?\.gg))\/(?<invite>.[\S]*)/g)?.[0]||"NULL"}','https://discord.com/channels/604636579545219072/${msg.channel.id}/${msg.id}')`))
				await
				con.query(`INSERT IGNORE INTO GuildsList (author,name,text,thematic,created,invite,link) VALUES ${query.join(",")}`)
			})
		})
	}
	async get(query){
		let partner = await con.query(`SELECT * FROM GuildsList WHERE link LIKE '%${query}%' OR name LIKE '%${query}%' OR invite LIKE '%${query}%'`)
		return new Partner(partner[0][0])
	}
	async partner(id){
		let list = await con.query(`SELECT * FROM GuildsList WHERE author = '${id}' AND deleted=0`);
		list = list[0]
		return new Stats({
			"o_day":filter(list,"o_day"),
			"o_week":filter(list,"o_week"),
			"report":filter(list,"interval",client.end_date),
			"o_month":filter(list,"o_month"),
			"all":list.length,
			"n_day":filter(list,"n_day"),
			"n_two_day":filter(list,"n_two_day"),
			"n_week":filter(list,"n_week"),
			"n_month":filter(list,"n_month"),
			"n_two_month":filter(list,"n_two_month")
		})
	}
	async partner_con(id,conc,p_date){
		let list = await con.query(`SELECT * FROM GuildsList WHERE author = '${id}' AND deleted=0`);
		list = list[0]
		if(conc === 'all') return {id:id,partners:list.length}
			else if(conc === 'report') return {id:id,partners:filter(list,"interval",client.end_date)}
				else  return {id:id,partners:filter(list,conc,p_date)}
	}
	async partner_nocon(id,conc,p_date){
		let [list] = await con.query(`SELECT * FROM GuildsList WHERE author = '${id}'`);
		if(conc === 'all') return {id:id,partners:list.length}
			else if(conc === 'report') return {id:id,partners:filter(list,"interval",client.end_date)}
				else  return {id:id,partners:filter(list,conc,p_date)}
	}
}

module.exports = Partners;
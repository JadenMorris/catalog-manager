let sklonenie = (number, txt, cases = [2, 0, 1, 1, 1, 2]) => txt[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]],
	moment = require('moment')
function mstime(ms) {
    return new Date(ms).toISOString().slice(11, -5);
}
function interval(dateo,datet,dates=[]){
	let time = Math.floor((datet-dateo)/86400000)
	for(i = 0;i<time;i++) dates.push({moment:require('moment')(datet-(86400000*i)).format("DD/MM"),db:require('moment')(datet-(86400000*i)).format("DD.MM.YY")})
	return dates.reverse()
}
function toTime(timestamp,time = []){
let duration = new moment.duration(timestamp)
let days = parseInt(duration.asDays()),
	hours = parseInt(duration.asHours()),
	min = parseInt(duration.asMinutes())%60,
	seconds = parseInt(duration.asSeconds())%60
	if(days > 0) time.push(`${days} ${sklonenie(days,['день','дня','дней'])}`)
    	if(hours > 0) time.push(`${hours} ${sklonenie(hours,['час','часа','часов'])}`)
        	if(min > 0 && time.length !== 2) time.push(`${min} ${sklonenie(min,['минута','минуты','минут'])}`)
        		if(time.length !== 2) time.push(`${seconds} ${sklonenie(seconds,['секунда','секунды','секунд'])}`);
return time.join(" и ");
}
module.exports = {
	attr:"",
	execute: async function (req,res) {
if(req.query.days){
let dates = interval(+require('moment')().add(-req.query.days,'days').startOf(),Date.now()),
	[stats] = await con.query(`SELECT * FROM Msgs WHERE User = ? AND Guild = '604636579545219072' AND Date IN (${dates.map(f=>`"${f.db}"`).join(",")})`,[req.query.user])
return res.send(`${stats.reduce((a,b)=>b.Count+a,0)}`)
}else{
let dates = interval(Date.now()-86400000*7,Date.now()),
	[rows] = await con.query(`SELECT * FROM Msgs WHERE User = ? AND Guild = ? AND Date = ?`,[req.query.user,'604636579545219072',moment().format("DD.MM.YY")]),
    [user_date] = await con.query(`SELECT * FROM AreumAlpha.users WHERE id = ?`,[req.query.user])
	if(req.query.type !== 'json') var [voice] = await con.query(`SELECT * FROM Voice WHERE Guild = '604636579545219072' AND User = ? AND Date = ?`,[req.query.user,moment().format("DD.MM.YY")])
		else var [voice] = await con.query(`SELECT * FROM Voice WHERE User = ? AND Date = ?`,[req.query.user,moment().format("DD.MM.YY")])
let stats_a = {}
	if(req.query.type === 'json') {
		var [stats] = await con.query(`SELECT * FROM Msgs WHERE User='${req.query.user}' AND Date IN (${dates.map(f=>`"${f.db}"`).join(",")})`)
		dates.map(f=>stats_a[f.db.slice(0,-3).replace(".","/")]=stats.find(c=>c.Date == f.db)?.Count||0)
	}
client.users.fetch(req.query.user).then((user)=>{
// let now = Date.now(),
// date = new Date(user_date[0][0]?.Date)>now?now:user_date[0][0]?.Date,
// timestamp = Number(user_date[0][0]?.Voice||0)+Number(((now - new Date(date))/1000).toFixed(2))||0,
// time = "";
let timestamp = voice[0]?voice[0].Timestamp == 0?voice[0].Time:Number(voice[0].Time)+(Date.now()-voice[0].Timestamp):0,time=toTime(timestamp);
if(req.query.type === 'json') res.send({
	"messages":`${rows[0]?.Count||0} ${sklonenie(rows[0]?.Count||0,['сообщение','сообщения','сообщений'])}`,
	"voice":time,
	"stats":stats_a
})
else res.send(`${rows[0]?.Count||0} ${sklonenie(rows[0]?.Count||0,['сообщение','сообщения','сообщений'])}|${time}|${Object.keys(user?.presence?.clientStatus||{}).length>0?"На данный момент в сети":!isNaN(Number(user_date[0]?.lastonline))?`В сети: ${require('moment')(+new Date(Number(user_date[0]?.lastonline))).format("DD MMMM 2021 года в HH:mm:ss")}`:""}`)
})
}
}}
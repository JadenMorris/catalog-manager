let moment = require('moment'),
    sklonenie = (number, txt, cases = [2, 0, 1, 1, 1, 2]) => txt[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]]
module.exports = {
	"attr":"",
	execute: async(req,res)=>{
try{
  let guild = await client.fetchInvite(req.query.invite),
      [guilds] = await con.query(`SELECT * FROM GuildsList WHERE id=? AND deleted=0 ORDER BY created+0 DESC`,[guild?.guild?.id])
  if(!guilds[0]) return res.send('false')
  let days = ~~((moment(Date.now()).startOf('days') - moment(+guilds[0].created).startOf('days'))/require('ms')('1d')),
      word = '';
  switch(days){
    case 0:word="Сегодня";break;
    case 1:word="Вчера";break;
    case 2:word="Позавчера";break;
    default:word=`${days} ${sklonenie(days,['день','дня','дней'])} назад`;break;
  }
  res.send(word)
}catch(err){
  res.send('false')
}
}}
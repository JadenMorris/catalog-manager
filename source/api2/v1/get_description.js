function uniq(a) {
    var seen = {};
    return a.filter(function(item) {
        return seen.hasOwnProperty(item) ? false : (seen[item] = true);
    });
}
function similar (a='',b=''){
    var lengthA = a.length;
    var lengthB = b.length;
    var equivalency = 0;
    var minLength = (a.length > b.length) ? b.length : a.length;    
    var maxLength = (a.length < b.length) ? b.length : a.length;    
    for(var i = 0; i < minLength; i++) {
        if(a[i] == b[i]) {
            equivalency++;
        }
    }
    var weight = equivalency / maxLength;
    return (weight * 100);
}
function checker(arr,value='') {for (var i = 0; i < arr.length; i++) {if (value.includes(arr[i])) return true;}return false;}
let sim = require('string-similarity'),
    emj = require('node-emoji'),
    moment = require('moment'),
    { MessageEmbed, Message, Util } = require('discord.js'),
    blacklist = [
  '703337125621399614', '732122894124974082',
  '736974051985326091', '750204710501220403',
  '726448421107400724', '734411143858094121',
  '816386354727747655', '814073397197144095',
  '213215290765344768', '796785634144288849',
  '680998935518511125', '804580974142029824',
  '790689146121224202', '808230739723419648',
  '819316122104889345', '798255710781177887',
  '778152453559681064', '746499033626837023',
  '812327251659718658', '601719846991822850',
  '820618566163628034', '798867454205231124',
  '853867905178665021', '853216155476426752',
  '706486568185102366', '806010537434677269',
  '854224683963645972', '640241835381489666',
  '851406375061291018', '837336092323348541',
  '784051090559467591', '755042090249093160',
  '514115731558891530', '806907350933176352',
  '858655188893171783', '866273288454930432',
  '823948293573967902', '876992550685270087',
  '879734549033140294', '871467602847866971',
  '858607321961332776', '839568446266408990',
  '696810867274154046'
]
module.exports = {
	attr:"",
	execute: async function (req,res) {
let text = req.body.text,
            invite = uniq(text.match(/(http|https):\/\/discord(?:(?:app)?\.com\/invite|\.gg(?:\/invite)?)\/([\w-]{2,255})/i)||[])
        require('node-fetch')(`https://discordapp.com/api/v9/invites/${invite[2]}?with_expiration=true&with_counts=true`).then(data=>data.json()).then(async guild=>{
            if(guild.expired_at) return res.send(`Временная ссылка`)
            if(blacklist.includes(guild.guild.id)) return res.send(`Сервер в чёрном списке`)
            text = text.replace(/(@everyone)|(@here)/g,'')
                       .replace(/(http|https):\/\/discord(?:(?:app)?\.com\/invite|\.gg(?:\/invite)?)\/([\w-]{2,255})/i,'')
            let split = text.trim().split('\n')
            if(split.some(f=>f.match(/(Пинг|Упом|Ping)(.+)/gi)?.[0] && f.replace(/`|\*/g,'').length < 15)) split.filter(f=>f.match(/(Пинг|Упом|Ping)(.+)/gi)?.[0] && f.length < 15).map(f=>text = text.replace(f,''))
                if(split.some(f=>f.match(/(ссылка|сылка|сыллка|инва|invit|пригл(а|о)шение|сервер|discord|с(с|)ылочка)/gi)?.[0] && f.replace(/`|\*/g,'').length < 15)) split.filter(f=>f.match(/(ссылка|сылка|сыллка|инва|invit|пригл(а|о)шение|сервер|discord|с(с|)ылочка)/gi)?.[0] && f.replace(/`|\*/g,'').length < 15).map(f=>text = text.replace(f,''))
                    if(split.some(f=>f.match(/(\*\*|)Описание(\D||\*\* )(-|—|:)/gi)?.[0])) split.filter(f=>f.match(/(\*\*|)Описание(\D||\*\* )(-|—|:)/gi)?.[0]).map(f=>text = text.replace(f,f.replace(/(\*\*|)Описание(\D||\*\* )(-|—|:)/gi,'')))
                        text = text.replace(/^(\*\*|)Партн(е|ё)р(.+|)(-|—|:)(.+)((@(.+)(([0-9]+)|(\.|\,)))|<(@|@!)[0-9]+>|\n)/im,'')
            let [guilds] = await con.query(`SELECT * FROM GuildsList WHERE id=? && deleted = 0 ORDER BY created+0 DESC`,[guild.guild.id]),
                now = Date.now()
            if(guilds[0]){
                let member = client.guilds.cache.get('604636579545219072').members.cache.get(guilds[0].text.split("\n")[1]?.match(/[0-9]+/g)?.[0])
                if((!member?.roles.cache.has('622501691107049502') && !member?.roles.cache.has('769916590686732319'))||guild.approximate_member_count < 490) {
                    text = text.split("\n").map(f=>f.replace(/(.)\1{2,}/g,"").replace(/https?:\/\/\S+/i,'')).filter(f=>f.match(/[а-я]/i)?.[0]).join("\n")
                    split = text.split("\n")
                    if(split.some(f=>f.match(/(картин|gif|гиф|бан(н|)ер)/gi)?.[0] && f.length < 15)) split.filter(f=>f.match(/(картин|gif|гиф|бан(н|)ер)/gi)?.[0] && f.length < 15).map(f=>text = text.replace(f,''))
                }
                partnerst[now] = {
                    guild:guilds[0].id,
                    partner:guilds[0].text.split("\n")[1]?.match(/[0-9]+/g)?.[0],
                    thematic:guilds[0].thematic,
                    channel:guilds[0].link.split("/")[guilds[0].link.split("/").length-2]
                }
            } else {
                    text = text.split("\n").map(f=>f.replace(/(.)\1{2,}/g,"").replace(/https?:\/\/\S+/i,'')).filter(f=>f.match(/[а-я]/gi)?.[0]).join("\n")
                    split = text.split("\n")
                    if(split.some(f=>f.match(/(картин|gif|гиф)/gi)?.[0] && f.length < 15)) split.filter(f=>f.match(/(картин|gif|гиф)/gi)?.[0] && f.length < 15).map(f=>text = text.replace(f,''))
                    partnerst[now] = {
                        partner:'',
                        thematic:'',
                        channel:''
                    }
                }
            split = text.split("\n")
            if(split[0].includes(guild.guild.name)) text = split.filter(f=>!((f.startsWith(guild.guild.name)||f.startsWith(`**${guild.guild.name}`))&&f.length<80)).join("\n")
            if((text.match(/\*\*/g)?.length||0)%2 !== 0){
                let replaced = text.split("\n").filter(f=>f.includes("**"))[text.split("\n").filter(f=>f.includes("**")).length-1];
                text = text.replace('**','')
            }
            text.split("\n").map(f=>text = text.replace(f,f.trim()))
            res.send(`**${guild.guild.name}** — ${partnerst[now].thematic}
**Партнёр** — ${partnerst[now].partner?`<@${partnerst[now].partner}>`:""}
**Описание** —
${text}
**Ссылка** — https://discord.gg/${invite[2]}`)
        }).catch((err)=>{
            return res.send(`Недействительная ссылка`)
        })
}}
let { MessageEmbed } = require('discord.js')
function convert(code,type="markdown"){
if(type === "markdown"){
    let strong = code.match(/\*\*/g)||[]
    if(strong.length%2 == 0 && strong.length !== 0) strong.map((f,i)=>code = code.replace(/\*\*/,i%2==0?"<strong>":"</strong>"))
    let cursive = code.match(/\*/g)||[]
    if(cursive.length%2 == 0 && cursive.length !== 0) cursive.map((f,i)=>code = code.replace(/\*/,i%2==0?"<i>":"</i>"))
    let crushed = code.match(/~~/g)||[]
    if(crushed.length%2 == 0 && crushed.length !== 0) crushed.map((f,i)=>code = code.replace(/~~/,i%2==0?"<s>":"</s>"))
    let codes = code.match(/\[[A-z]+\]/g)||[]
    if(codes.length !== 0) codes.map(c=>code = code.replace(c,`<span class="${c.slice(1,-1).toLowerCase()}">${c.slice(1,-1)}</span>`))
    return code.split("\n").map(f=>`<p>${f}</p>`).join("\n")
}else{
    return code.replace(/<(\/|)strong>/g,'**').replace(/<(\/|)i>/g,'*').replace(/<(\/|)s>/g,'~~').replace(/\[[A-z]+\]/g,'').replace(/<br>/g,'\n')
}
}
module.exports = {
    name: "changes",
    execute: async function (message, args, locale, sys) {
if(!config.owners.includes(message.author.id)) return;
if(args[0] === 'add'){ con.query(`INSERT INTO ChangeLogs (Value,Version) VALUES (?,?)`,[convert(args.slice(2).join(" ")),args[1]]);message.react('833090699993284628') }   
else if(args[0] === 'edit'){ con.query(`UPDATE ChangeLogs SET Value=? WHERE Version = ?`,[convert(args.slice(2).join(" ")),args[1]]);message.react('833090699993284628') }   
else if(args[0] === 'delete'){ con.query(`DELETE FROM ChangeLogs WHERE Version = ?`,[args[1]]);message.react('833090699993284628') }   
else{
    let [versions] = await con.query(`SELECT * FROM ChangeLogs ORDER BY ID DESC`),
    embed = new MessageEmbed().setTitle(`Список версий`).setColor(message.member.roles.highest.hexColor)
    versions.map(ver=>embed.addField(`v ${ver.Version}`,ver.Value.replace(/<[^>]+>/g,''),true))
    message.channel.send(embed)
}
}}
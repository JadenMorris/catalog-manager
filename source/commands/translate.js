let Discord = require('discord.js')
module.exports = {
    name: "translate",
    aliases:["tl"],
    description: 'Перевести текст на указанный вами язык',
    execute: async function (message, args) {
        console.log('ok')
if(!args[0] || !args[1]) return
try{
	var {text} = await translator(args.slice(1).join(" "), {to:args[0]})
}catch{
	return 
}
let embed = new Discord.MessageEmbed()
.setTitle(`Переводчик`)
.addField(`Введённый текст`,`\`\`\`fix
${args.slice(1).join(" ")}
\`\`\``,true)
.addField(`Переведённый текст`,`\`\`\`fix
${text}
\`\`\``)
.setFooter(`KC ${message.author.tag}`)
.setColor("#000033")
message.channel.send(embed)
}}
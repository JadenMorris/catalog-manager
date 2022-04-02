let { MessageEmbed } = require('discord.js');
module.exports = {
    name: "help",
    aliases: [],
    description: 'Помощь по командам.',
    use:"help",
    execute: async function (message, args, locale, sys) {
if(!message.token) return;
let author = client.users.cache.get(message.member.user.id)
if(!message.data.options?.[0]){
    let embed;
    if(message.guild.id !== '604636579545219072') embed = new MessageEmbed()
        .setAuthor(author.username,author.displayAvatarURL({dynamic:true,size:2048,format:"png"}))
        .setTitle(`**≫ Список команд ≪**`)
        .addField(`<:blank:867874000813686804><:blank:867874000813686804>Статистика`,`\`/top\` \`/stats\` \`/bot\` \`/info\``)
        .addField(`<:blank:867874000813686804><:blank:867874000813686804>Настройка`,` \`/remind\``)
        .setColor("#29090b")
        .setFooter(`Всего команд: 5`,client.user.displayAvatarURL({dynamic:true,size:2048,format:"png"}))
        .toJSON()
    else embed = new MessageEmbed()
        .setAuthor(author.username,author.displayAvatarURL({dynamic:true,size:2048,format:"png"}))
        .setTitle(`**≫ Список команд ≪**`)
        .addField(`<:blank:867874000813686804><:blank:867874000813686804>Статистика`,`\`/top\` \`/stats\` \`/bot\` \`/remind\` \`/info\``)
        .addField(`<:blank:867874000813686804>Пиар-менеджерам`,`\`/server\` \`/sakura\``)
        .setColor("#29090b")
        .setFooter(`Всего команд: 7`,client.user.displayAvatarURL({dynamic:true,size:2048,format:"png"}))
        .toJSON()
client.api.interactions(message.id,message.token).callback.post({
data:{
    type:4,
    data:{
        content:"",
        embeds:[embed]
    }
}
})
}else{
let command = client.commands.get(message.data.options[0].value) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(message.data.options[0].value));
if(!command) return;
client.api.interactions(message.id,message.token).callback.post({
data:{
    type:4,
    data:{
        content:"",
        embeds:[new MessageEmbed()
        .setTitle(`Команда: ${command.name}`)
        .setDescription(`${command.description||"Отсутствует"}`)
        .addField(`Информация`,`**Псевдонимы:** ${command.aliases?.map(f=>`\`${f}\``).join(" ")||"Отсутствуют"}`)
        .addField(`Использование`,`\`\`\`markdown
> /${command.use}\`\`\``)
        .setFooter(`${client.user.username}`,client.user.displayAvatarURL({dynamic:true,size:2048,format:"png"}))
        .setColor("#29090b")
        .toJSON()]
    }
}
})
}
}}
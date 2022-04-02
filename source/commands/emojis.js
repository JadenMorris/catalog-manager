let { sync } = require('executive'),
    { MessageAttachment } = require('discord.js')
module.exports = {
    name: "emojis",
    execute: async function (message, args, locale, sys) {
Promise.all(message.guild.emojis.cache.filter(f=>!f.animated).map(f=>sync(`wget -P ./fls/${message.guild.id} ${f.url}`))).then(async ()=>{
    sync(`zip -r ./fls/${message.guild.id}/emojis_${message.guild.id}.zip ./fls/${message.guild.id}`)
    await message.channel.send(`Emojis`,{files:[new MessageAttachment(`./fls/${message.guild.id}/emojis_${message.guild.id}.zip`)]}).then(()=>sync(`rm -rf ./fls/${message.guild.id}`))
})
}}
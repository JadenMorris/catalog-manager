let { sync } = require('executive')
module.exports = {
    "attr":":guild",
    execute: async(req,res)=>{
        let guild = client.guilds.cache.get(req.params.guild)
        if(!guild) return res.send('')     
        client.api.guilds(guild.id).stickers.get().then(stickers=>{
        Promise.all(guild.emojis.cache.filter(f=>!f.animated).map(f=>sync(`wget -P ./fls/${guild.id}/Default ${f.url}`)).concat(
                guild.emojis.cache.filter(f=>f.animated).map(f=>sync(`wget -P ./fls/${guild.id}/Animated ${f.url}`)),
                stickers.map(f=>sync(`wget -P ./fls/${guild.id}/Stickers https://media.discordapp.net/stickers/${f.id}.png`))
            )).then(async ()=>{
            require('exec-sh')(`cd /root/catalog/fls/${guild.id} && zip -r /root/catalog/fls/${guild.id}/emojis_${guild.id}.zip ./`,()=>{
            res.writeHead(200, {
                "Content-Type": "application/octet-stream",
                "Content-Disposition": `attachment; filename=emojis_${guild.id}.zip`
            }); 
            require('fs').createReadStream(`./fls/${guild.id}/emojis_${guild.id}.zip`).pipe(res);
            io.sockets.sockets.get(req.query.socket)?.emit("download",JSON.stringify({guild:guild.id}))
            setTimeout(()=>sync(`rm -rf ./fls/${guild.id}`),require('ms')('2m'))
            })
        })
        })
  }}
let pm_channels = ['642102626070036500','747807222247063642','642085815597400065','642104779270782986','747813531495301161'],
            ignore = ['764911620111204383','703575115958452266'],
            ae = new (require('../cogs/AdamEva.js'))(),
            moment = require('moment')
let cooldown = new Set();
module.exports = async message => { 
    if(message?.data?.custom_id){ 
        if(message.message.components[0].components[0].custom_id.split("_")[0] === 'post' && message.message.components[0].components[0].custom_id.split("_")[1] !== message.member.user.id) return;
        require('node-fetch')(`https://discord.com/api/v9/interactions/${message.id}/${message.token}/callback`,{"method":"POST",body:JSON.stringify({
            "type": 6
        }),headers: { Authorization:  `Bot ${client.token}`,"Content-Type":"application/json"}})
        if(message.message.components[0].components[0].custom_id.split("_")[0] === 'post'){message.message.components[0].components[0].disabled = true;
        let components = {components:message.message.components}
        require('node-fetch')(`https://discordapp.com/api/v9/channels/${message.channel_id}/messages/${message.message.id}`, {method:"PATCH", body:JSON.stringify(components), headers: { Authorization:  `Bot ${client.token}`,"Content-Type":"application/json"}})}
        let msg = await client.channels.cache.get(message.channel_id).messages.fetch(message.message.id)
            msg.token = message.token,
            msg.author_id = message.message.components[0].components[0].custom_id.split("_")[1],
            msg.custom_id = message.data.custom_id,
            msg.user = client.users.cache.get(message.member.user.id);
        if(message.message.components[0].components[0].custom_id.split("_")[0] === 'post') return client.commands.get('sakura').execute(msg,msg.content.split(" ").slice(1))
            else{
                require(`../actions/${message?.data?.custom_id.split("_")[0]}.js`).execute(message,message?.data?.custom_id.split("_").slice(1))
                return delete require.cache[require.resolve(`../actions/${message?.data?.custom_id.split("_")[0]}.js`)]
            }
    }
    if(message.author?.bot && message.content?.includes('Значок')){
        let text = [message.content.split(" ")[2],message.content.split(" ")[message.content.split(" ").length-1].match(/[0-9]+/g)[0]]
        if(message.content.includes(`выдан`)){
            con.query(`INSERT INTO Badges (User,Badge) VALUES (?,?)`,[text[1],text[0]])
        }else{
            con.query(`DELETE FROM Badges WHERE User = ? AND Badge = ?`,[text[1],text[0]])
        }
    }
    if(message.channel?.id == '689498439012319293' && message.content?.startsWith('K.addbl')) {
        client.fetchInvite(message.content.split(" ")[1]).then(async x => {
            con.query(`INSERT INTO Blacklist(id,invite,reason) VALUES ('${x.guild.id}','${message.content.split(" ")[1]}',?)`,[message.content.split(" ").slice(2).join(" ")])
        })
    }
    if(Object.entries(site.users).find(c=>c[1]?.user === message.author?.id)) Object.entries(site.users).filter(c=>c[1]?.user === message.author.id).map(f=>f[1].socket.emit("message"))
    if (message.author?.bot && message.author?.id !== '656029229749764126') return null;
    if (message.channel?.id === '740218046118887569' && message.content?.includes('docs.google.com')) {client.end_date = +require('moment')().clone().startOf('day')};
    if (pm_channels.includes(message.channel?.parentID) && !ignore.includes(message.channel?.id)) {
        let invite = message.content.match(/((http|https):\/\/discord(?:(?:app)?\.com\/invite|\.gg(?:\/invite)?)\/([\w-]{2,255}))/i)?.[0];
            client.fetchInvite(invite).then(guild=>{
                con.query(`INSERT IGNORE INTO GuildsList (id,author,name,text,thematic,created,invite,link) VALUES ('${guild.guild.id}','${message.author.id}','${message.content.split("—")[0]?.trim().replace(/\'/g,"''").replace(/\*/g,'')||"NULL"}','${message.content?.replace(/\'/g,"''")||"NULL"}','${message.content.split("\n")[0]?.split("—")?.[message.content.split("\n")[0]?.split("—").length-1]?.replace(/\'/g,"''").replace(/\*/g,'').trim()||"NULL"}','${message.createdTimestamp}','${invite}','https://discord.com/channels/604636579545219072/${message.channel.id}/${message.id}')`)
            })
    }
    if(message.member?.roles.cache?.get("677397817966198788")){
        if(message.content.match(/^K\.ban (<@|)[0-9]+(>|)/m)?.[0]) {
            let [status] = await con.query(`SELECT * FROM MDStats WHERE User=? AND Date=?`,[message.author.id,require('moment')(Date.now()).format("YYYY-MM-DD")])
            if(!status[0]) con.query(`INSERT INTO MDStats (User,Bans) VALUES (?,1)`,[message.author.id])
                else con.query(`UPDATE MDStats SET Bans=Bans+1 WHERE User=? AND Date=?`,[message.author.id,status[0].Date])
        } else if(message.content.match(/^K\.mute (<@!|<@|)[0-9]+(>|) [0-9]+h (.*)+/m)?.[0]){
            let [status] = await con.query(`SELECT * FROM MDStats WHERE User=? AND Date=?`,[message.author.id,require('moment')(Date.now()).format("YYYY-MM-DD")])
            if(!status[0]) con.query(`INSERT INTO MDStats (User,Mutes) VALUES (?,1)`,[message.author.id])
                else con.query(`UPDATE MDStats SET Mutes=Mutes+1 WHERE User=? AND Date=?`,[message.author.id,status[0].Date])
        } else if(message.content.match(/^K\.warn (<@|)[0-9]+(>|) (.*)+/m)?.[0]){
            let [status] = await con.query(`SELECT * FROM MDStats WHERE User=? AND Date=?`,[message.author.id,require('moment')(Date.now()).format("YYYY-MM-DD")])
            if(!status[0]) con.query(`INSERT INTO MDStats (User,Warns) VALUES (?,1)`,[message.author.id])
                else con.query(`UPDATE MDStats SET Warns=Warns+1 WHERE User=? AND Date=?`,[message.author.id,status[0].Date])
        } else if(message.content.match(/^(K\.verbal|K\.v) (<@|)[0-9]+(>|)/m)?.[0] || message.content.startsWith("~v")){
            let [status] = await con.query(`SELECT * FROM MDStats WHERE User=? AND Date=?`,[message.author.id,require('moment')(Date.now()).format("YYYY-MM-DD")])
            if(!status[0]) con.query(`INSERT INTO MDStats (User,Warns) VALUES (?,1)`,[message.author.id])
                else con.query(`UPDATE MDStats SET Verbals=Verbals+1 WHERE User=? AND Date=?`,[message.author.id,status[0].Date])
        } else if(message.channel.parentID == '604636579545219073' && message.content.match(/^~(.*)+ [0-9]+(h|)/m)?.[0]){
            let [status] = await con.query(`SELECT * FROM MDStats WHERE User=? AND Date=?`,[message.author.id,require('moment')(Date.now()).format("YYYY-MM-DD")])
            if(!status[0]) con.query(`INSERT INTO MDStats (User,Warns,Mutes) VALUES (?,1,1)`,[message.author.id])
                else con.query(`UPDATE MDStats SET Warns=Warns+1, Mutes=Mutes+1 WHERE User=? AND Date=?`,[message.author.id,status[0].Date])
        }
    }
    if(message.author?.id == '656029229749764126') {
        if(message.embeds[0]?.author?.name.includes('Новый партнёр')){
            let user = message.embeds[0].footer?.text.split(" | ")[1].slice(0,18),
                [stats] = await con.query(`SELECT * FROM NPS WHERE User=? AND Date > ?`,[user,+require('moment')().startOf('days')])
            if(!stats[0]) con.query(`INSERT INTO NPS (User,Date) VALUES (?,?)`,[user,Date.now()])
                else con.query(`UPDATE NPS SET Count=Count+1 WHERE User=? AND Date > ?`,[user,+require('moment')().startOf('days')])
        }
    }
    if(!message.token && message.channel.type !== 'dm' && !message.author.bot && message.author.id !== '571006178444836875'){
        // con.query("INSERT INTO Messages (Guild,Author,Channel,MsgID,Content,Embeds,Attachments) VALUES (?,?,?,?,?,?,?)",[message.guild.id,message.author.id,message.channel.id,message.id,message.content||"[Empty]",JSON.stringify(message.embeds[0]?.toJSON()||{})||"[Empty]",message.attachments.map(f=>f.proxyURL).join(",")||"[Empty]"])
        let [msgs] = await con.query(`SELECT * FROM Msgs WHERE Guild = ? AND User = ? AND Date = ?`,[message.guild.id,message.author.id,moment().format("DD.MM.YY")])
        if(msgs[0]) con.query(`UPDATE Msgs SET Count=Count+1 WHERE Guild = ? AND User = ? AND Date = ?`,[message.guild.id,message.author.id,moment().format("DD.MM.YY")])
            else con.query(`INSERT INTO Msgs (Guild,User,Date,Count) VALUES (?,?,?,?)`,[message.guild.id,message.author.id,moment().format("DD.MM.YY"),1])
    }
    let data = message.guild?.data||({"id":"DM","language":"ru","prefix":"/"})
    if (!data) {
        let res = await con.query(`SELECT * FROM Guilds WHERE id = ?`,[message.guild.id])
        if(!message.guild.data && !res[0][0]) con.query(`INSERT IGNORE INTO Guilds (id) VALUES ('${message.guild.id}')`);
        message.guild.data = {
            id: message.guild.id,
            language: res[0][0]?.language||"ru",
            prefix: res[0][0]?.prefix||","
        }
    } 
    // if(message.attachments?.first()){
    //     let name = `${message.author.id}_${Date.now()}`,
    //         format = message.attachments.first().name.split(".")[message.attachments.first().name.split(".").length-1];
    //     require('executive').sync(`curl -o fls/${name}.${format} ${message.attachments.first().proxyURL}`,(err,f,a)=>{
    //         if(err) return;
    //         setTimeout(()=>{
    //         client.ftpclient.append(`fls/${name}.${format}`,`images/${name}.${format}`,function(err) {
    //           if (err) console.log(err)
    //             require('executive').sync(`rm fls/${name}.${format}`)
    //         });
    //         },3000)
    //     })
    // }


    let args = message.content
        ?.slice(data.prefix.length)
        .trim()
        .split(/ +/) || [message.data.name];
    message._flags = new Set();
    args.map(x => {
        if (x.startsWith('--')) {
            message._flags.add(x.replace('--', ''))
            delete args[args.indexOf(x)];
        }
    });
    if((message.channel?.id === '642190411867226112' || message.channel?.id === '922222495317254164')&& !message.content?.startsWith(data.prefix) && message.content?.match(/(http|https):\/\/discord(?:(?:app)?\.com\/invite|\.gg(?:\/invite)?)\/([\w-]{2,255})/i)?.[0]) return client.commands.get('sakura').execute(message,message.content.split(" "))
    // if(!message.token && (message.author.id === '571006178444836875' && message.channel.id === '728932829026844672' && message.content.split("")?.[0].match(/[A-z0-9]+/g)?.[0] && !message.content.startsWith(data.prefix))){
    //     return client.commands.get('eval').execute(message,message.content.split(" "))
    // }
    if (!message.content?.startsWith(data.prefix) && !message.token) return;
    const commandName = args.shift().toLowerCase();
    const command =
        client.commands.get(commandName) ||
        client.commands.find(
            cmd => cmd.aliases && cmd.aliases.includes(commandName)
        );
    if (!command) return null;
    // if (cooldown.has(data.id)) return message.channel.send(Translate.get(data.language, 'global').command_cooldown);
    cooldown.add(data.id);
    if(message.token) message.guild = client.guilds.cache.get(message.guild_id)
    let cmd = await con.query(`SELECT * FROM Commands WHERE name='${commandName}'`)
    if(!cmd[0][0]) con.query(`INSERT INTO Commands (name,uses) VALUES ('${commandName}',1)`)
    setTimeout(() => { cooldown.delete(data.id) }, 5000)
    command.execute(
        message,
        args,
        Translate.get(data.language, command.name),
        Translate.get(data.language, 'global')
    );
};

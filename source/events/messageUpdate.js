let pm_channels = ['642102626070036500','747807222247063642','642085815597400065','642104779270782986','747813531495301161'],
    ignore = ['764911620111204383','703575115958452266']

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = async (old,message) => {
if(message.channel.id == '703615708323643482' && message.author.id == '656029229749764126' && message.embeds[0]?.author?.name.startsWith('KC Safety |') && message.embeds[0]?.description?.includes('Меры приняты')){
    let user = message.guild.roles.cache.get('677397817966198788').members.find(x => x.user.username == message.embeds[0].author.name.slice("KC Safety | ".length))?.user,
        action = '';
    let [status] = await con.query(`SELECT * FROM MDStats WHERE User=? AND Date=?`,[user.id,require('moment')(Date.now()).format("YYYY-MM-DD")])
    if(!status[0]) con.query(`INSERT INTO MDStats (User) VALUES (?)`,[user.id])
    await sleep(1000)
    if(message.embeds[0].description.match(/\[[0-9]+\] был забанен/)) action = 'ban'
        else if(message.embeds[0].description.match(/Время: [0-9]+/)) action = 'mute'
            else if(message.embeds[0].description.match(/Случай: [0-9]+\nПричина: /)) action = 'warn'
                else if(message.embeds[0].description.includes("Меры приняты [устный варн]:")) action = 'verbal'
    switch(action){
        case "ban": con.query(`UPDATE MDStats SET Bans=Bans+1 WHERE User=? AND Date=?`,[user.id,require('moment')(Date.now()).format("YYYY-MM-DD")]);break;
        case "mute": con.query(`UPDATE MDStats SET Mutes=Mutes+1 WHERE User=? AND Date=?`,[user.id,require('moment')(Date.now()).format("YYYY-MM-DD")]);break;
        case "warn": con.query(`UPDATE MDStats SET Warns=Warns+1 WHERE User=? AND Date=?`,[user.id,require('moment')(Date.now()).format("YYYY-MM-DD")]);break;
        case "verbal": con.query(`UPDATE MDStats SET Verbals=Verbals+1 WHERE User=? AND Date=?`,[user.id,require('moment')(Date.now()).format("YYYY-MM-DD")]);break;
    }
    con.query(`UPDATE MDStats SET Complaints=Complaints+1 WHERE User=? AND Date=?`,[user.id,require('moment')(Date.now()).format("YYYY-MM-DD")]);
}
if (!pm_channels.includes(message.channel.parentID) || ignore.includes(message.channel.id)) return
if(message.content.split("—")[0] === '' || !message.content || !message.content.split("\n")[0]?.split("—")[1]) return
con.query(`UPDATE GuildsList SET name=?,text=?,thematic=?,invite=? WHERE link LIKE '%${message.id}%'`,[message.content.split("—")[0].replace(/\*/g,'').replace(/\'/g,"''").trim(),message.content.replace(/\'/g,"''"),message.content.split("\n")[0]?.split("—")[1].replace(/\'/g,"''").replace(/\*/g,'')?.trim(),message.content.match(/(https:\/\/)?(www\.)?(((discord(app)?)?\.com\/invite)|((discord(app)?)?\.gg))\/(?<invite>.[\S]*)/g)?.[0]||"NULL"])
}
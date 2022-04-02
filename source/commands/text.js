let Discord = require('discord.js')
let moment = require('moment');

module.exports = {
    name: "text",
    aliases:[],
    description: '',
    execute: async function (message, args) {
        let [partners] = await con.query(`SELECT * FROM GuildsList WHERE deleted=0 ORDER BY created+0`), users = {};
        partners = partners.filter(f=>[moment().add(-1,'days').format("DD.MM.YY"),moment().add(-2,'days').format("DD.MM.YY")].includes(moment(+f.created).format("DD.MM.YY")))
        partners.forEach(user=>{
            users[user.author]?users[user.author]++:users[user.author] = 1;
        })
        let [nps] = await con.query(`SELECT User,SUM(Count) as count FROM NPS WHERE Date > ${client.end_date} GROUP BY User ORDER BY count DESC`);
        var map = nps.reduce((r, i) => {
            r[i.count] = r[i.count] || [];
            r[i.count].push(i);
            return r;
        }, {})
        var top = [];
        for (var key in map) {
            top.push(map[key]);
        }
        top.sort((a,b) => b[0]?.count-a[0]?.count);
        message.channel.send(`<@&686621891230040077>
Отчёт за ${moment().add(-2,'days').format("DD")}-${moment().add(-1,'days').format("DD")} числа:
https://docs.google.com/spreadsheets/d/19pb65rahlnV2dLhjx1hTjz-WA-jTA19tBUSv5J7I2Hw/edit#gid=1324561912
${Object.keys(users).sort((a,b)=>users[b]-users[a]).filter(x => users[x] >= 15).map(x => `<@${x}>`).join(", ")} — Отлично поработали, пусть остальные берут с вас пример. Награждаетесь медалькой за хороший актив. :military_medal:
Представляю топ 3 за приведение новых партнёров:
:first_place: ${top[0].map(x => `<@${x.User}>`).join(", ")} — ${top[0][0].count}
:second_place: ${top[1].map(x => `<@${x.User}>`).join(", ")} — ${top[1][0].count}
:third_place: ${top[2].map(x => `<@${x.User}>`).join(", ")} — ${top[2][0].count}
Неплохо потрудились за прошедшие два дня, продолжайте в том же духе.`,{code:"js"})
    }}
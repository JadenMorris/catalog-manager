const { MessageEmbed,MessageAttachment } = require('discord.js');
let { ChartJSNodeCanvas } = require('chartjs-node-canvas'),
    moment = require('moment');
let sklonenie = (number, txt, cases = [2, 0, 1, 1, 1, 2]) => txt[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
function numberWithSpaces(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function interval(start,end,arr = []){
for (let i=+moment(start-end+86400000); i < moment(start+86400000); i=i+24*60*60*1000) arr.push(moment(i).format("DD.MM.YY"))
return arr
}
function reverse(s){
    return s.split("").reverse().join("");
}
module.exports = {
    name: "stats",
    description: 'Статистика притока сервера.',
    aliases:['statistic'],
    use:"stats",
    execute: async function (message, args, locale, sys) {
if(!message.token) return;
client.api.interactions[message.id][message.token].callback.post({data:{
    type:5
}})
    let stats = await con.query(`SELECT * FROM GStats WHERE Date IN (?,?,?,?,?,?,?) AND Guild='${message.guild.id}' LIMIT 7`,interval(moment(),require('ms')('7d'))),labels = []
        stats[0].sort((a,b)=>{
            let date = [a.Date.split("."),b.Date.split(".")]
            return moment(`${date[0][1]}.${date[0][0]}.${date[0][2]}`)-moment(`${date[1][1]}.${date[1][0]}.${date[1][2]}`)
        })
        stats[0].forEach(s=>{
            let date = s.Date.split(".")
            labels.push(moment(`${date[1]}.${date[0]}.${date[2]}`).format("DD MMM"))
        })
                const configuration = {
                    type: 'line',
                    data: {
                        labels,
                        datasets: [{
                            data:stats[0].map(f=>f.Members||0),
                            backgroundColor: "rgb(52,55,91)",
                            borderColor: '#7386d6',
                            borderWidth: 2,
                            fill:true,
                            cubicInterpolationMode: 'monotone'
                        }]
                    },
                    options: {
                        scaleStartValue:300,
                        plugins: {
                            legend: {
                              display: false
                            }
                        },
                        scales: {
                            yAxes: [{
                                ticks: {
                                    beginAtZero: true,
                                    maxRotation: 90,
                                    minRotation: 90,
                                    callback: (value) => value
                                }
                            }],
                            xAxes: [{
                                gridLines:{
                                  color: "#fff",
                                  lineWidth:2
                                }
                            }],
                        }
                    },
                    plugins:[{
                      id: 'custom_canvas_background_color',
                      beforeDraw: (chart) => {
                        const ctx = chart.canvas.getContext('2d');
                        ctx.save();
                        ctx.globalCompositeOperation = 'destination-over';
                        ctx.fillStyle = '#2e3136';
                        ctx.fillRect(0, 0, chart.width, chart.height);
                        ctx.restore();
                      }
                    }]
                };
                const canvasRenderService = new ChartJSNodeCanvas({ width:1000, height:400 });
                const image = await canvasRenderService.renderToBuffer(configuration);
                const attachment = new MessageAttachment(image,'stats.png'); 
                let embed = new MessageEmbed().attachFiles(attachment).setTitle(`Статистика сервера \`${message.guild.name}\``)
                .addField(`Участники`,`
                    Боты: \`${numberWithSpaces(message.guild.members.cache.filter(f=>f.user.bot).size)}\`
Пользователи: \`${numberWithSpaces(message.guild.memberCount)}\``)
                stats[0] = stats[0].reverse()
                let stat7 = ((message.guild.memberCount-stats[0][0].Members)/stats[0][0].Members*100).toFixed(2),
                    stat14 = ((message.guild.memberCount-stats[0][stats[0].length-1].Members)/stats[0][stats[0].length-1].Members*100).toFixed(2),
                    stat14_red = stats[0].reduce((a,b)=>a+(b.Joined-b.Leaves),0),
                    stat7_red = stats[0][0].Joined-stats[0][0].Leaves,
                    emoji_14,emoji_7;
                if(stat14 > 0){
                    if(stat14 > 0.10) emoji_14 = `<:d_chevron:888349670483578900>`
                        else emoji_14 = `<:chevron:888349811026300989>`
                }else if(stat14 < 0){
                    if(stat14 < 0.10) emoji_14 = `<:d_arrow:888350001913290762>`
                        else emoji_14 = `<:arrow:888349912675283005>`
                }else emoji_14 = `<:none:888350172990537759>`

                if(stat7 > 0){
                    if(stat7 > 0.05) emoji_7 = `<:d_chevron:888349670483578900>`
                        else emoji_7 = `<:chevron:888349811026300989>`
                }else if(stat7 < 0){
                    if(stat7 < 0.05) emoji_7 = `<:d_arrow:888350001913290762>`
                        else emoji_7 = `<:arrow:888349912675283005>`
                }else emoji_7 = `<:none:888350172990537759>`;
                embed.addField(`Приток за 7 дней`,`**Изменение:** \`${stat14_red>0?"+":""}${stat14_red==0?0:stat14_red}\` ${stat14>0?"+":""}\`${stat14==0?0:stat14}%\`${emoji_14}`)
                embed.addField(`Приток за сегодня`,`**Изменение:** \`${stat7_red>0?"+":""}${stat7_red==0?0:stat7_red}\` ${stat7>0?"+":""}\`${stat7==0?0:stat7}%\`${emoji_7}`)
                .setImage('attachment://stats.png').setColor("#2e3136")
                .setTimestamp()
                .setFooter(`По запросу ${message.member.user.username}`)
        client.api.webhooks[client.user.id][message.token].messages['@original'].patch({
            data:{
                    content:"",
                    embeds:[embed.toJSON()],
                    files: embed.files
            }
        })
}} 
const moment = require('moment');
const { MessageEmbed } = require('discord.js')

module.exports = {
    name: "otchet",
    execute: async function (message, args, locale, sys) {
if(!config.owners.includes(message.author.id) && message.author.id != '420506181627412501') return;
let [nps] = await con.query(`SELECT User,SUM(Count) as count FROM NPS WHERE Date > ${client.end_date} GROUP BY User ORDER BY count DESC`),
    embed = new MessageEmbed()
.addField(`Новые партнёры`,nps.map(x => `<@${x.User}> — \`${x.count}\``).join("\n"))
message.channel.send(embed)
}}
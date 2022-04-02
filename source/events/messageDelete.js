let pm_channels = ['642102626070036500','747807222247063642','642085815597400065','642104779270782986','747813531495301161']
module.exports = async (message) => {
if (!pm_channels.includes(message.channel.parentID)) return;
con.query(`UPDATE GuildsList SET deleted=1 WHERE link LIKE '%${message.id}%'`);
}
let { Client } = require('discord.js'),
interaction = require('discord-slash').Client,
{ PartnerGuild } = require('./Monitoring.js'),
ftp = require('ftp'),
nodemailer = require('nodemailer');
require('./IO.js')

class CatalogClient extends Client {
    constructor(opts) {
        super(opts);
        // this.slash = new interaction(config.auth,'817749615667445790');
        this.pm = {};
        this.pm_date = {}
        this.ftpclient = new ftp();
        this.list_stats = {}
        this.transporter = nodemailer.createTransport({
		    port: 25,
		    host: 'mail.catalogserverov.ml',
		    tls: {
		      rejectUnauthorized: false
		    },
		});

    }
    login(token) {
        return super.login(token);
    }
    async guildInfo(id,mon){
    	return new Promise(async(res,rej)=>{
			let guild = client.guilds.cache.get(id);
			if(!guild) return {};
			let stats = guild_stats[guild.id]
			res(new PartnerGuild({
			"id":guild.id,
			"name":guild.name,
			"icon":guild.icon,
			"banner":guild.banner?`https://cdn.discordapp.com/banners/${guild.id}/${guild.banner}.png?size=2048`:`https://cdn.discordapp.com/attachments/728932829026844672/844249652400488478/pm1.png`,
			"roles":guild.roles.cache?.size,
			"emojis":guild.emojis.cache?.size,
			"members":guild.memberCount,
			"channels":guild.channels.cache?.size,
			"stats":{
				"messages":{
					"today":stats?.messages?.today,
					"yesterday":stats?.messages?.yesterday
				},
				"voice":{
					"today":stats?.voice?.today,
					"yesterday":stats?.voice?.yesterday
				},
				"users":{
					"today":stats?.users?.today,
					"yesterday":stats?.users?.yesterday
				}
			},
			"tags":mon.tags,
			"public_tags":mon.public_tags||"[]",
			"invite":mon.invite,
			"Large_T":mon.Large_T||"[]",
			"rating":mon.rating,
			"union": guild.union(),
			"bumps": mon.bumps,
			"last_bump": mon.cooldown,
			"created": guild.createdTimestamp,
			"comments": await con.query(`SELECT * FROM Comments WHERE Guild='${guild.id}' ORDER BY Date+0 DESC`) ,
			"ispartner": false,
			"public":mon.public,
			"views":mon.views
		}))})
	}
	async guildsList(){
		return new Promise(async(res,rej)=>{
			let [guilds] =await con.query(`SELECT * FROM Partners`)
			Promise.all(guilds.filter(f=>client.guilds.cache.get(f.id) && f.tags && f.Large_T?.length > 25 && f.public_tags?.length > 3).map((guild)=>this.guildInfo(guild.id,guild))).then(list=>res(list.sort((a,b)=>b.bumps-a.bumps)))
		})
	}
	async fetchPartners(){
	client.channels.cache.get('740218046118887569').messages.fetch().then(obl=>{
		obl = obl.filter(f=>f.content.toLowerCase().includes('spreadsheets')).first();
		this.end_date = +require('moment')(obl.createdTimestamp).clone().startOf('day');
	})
	}
	async send(options){
		return this.transporter.sendMail(options)
	}
}
require('discord.js').Channel.prototype.fetchMessages = async function(limit = 500) {
    const sum_messages = [];
    let last_id;
    while (true) {
        const options = { limit: 100 };
        if (last_id) options.before = last_id;
        const messages = await this.messages.fetch(options);
        sum_messages.push(...messages.array());
        last_id = messages.last()?.id;
        if (messages.size != 100 || sum_messages >= limit) break;
    }
    return sum_messages;
}
module.exports = CatalogClient
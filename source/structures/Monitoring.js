class PartnerGuild{
	constructor(guild){
		Object.keys(guild).map(val=>this[val] = guild[val])
	}
}
class Partner{
	constructor(guild){
		Object.keys(guild).map(val=>this[val] = guild[val])
	}
}

module.exports = { Partner, PartnerGuild }
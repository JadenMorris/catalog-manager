let Discord = require('discord.js')
Array.prototype.division = function(size,subarray = []){
for (let i = 0; i <Math.ceil(this.length/size); i++){
    subarray[i] = this.slice((i*size), (i*size) + size);
}
return subarray
}
Discord.Guild.prototype.isPartner = async function(){
let [guild] = await con.query(`SELECT * FROM GuildsList WHERE id='${this.id}' AND deleted=0`)
return !!guild[0]
}
Discord.Guild.prototype.union = function(){return config.union.includes(this.id)}
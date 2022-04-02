require('discord.js').Message.prototype.perFlags = function(){
this.tflags = {}
let arg = this.content.match(/--[A-z]+=[^\s]+/gi)||[]
arg.map(a=>a.split("=")[1]?this.tflags[a.split("=")[0].slice(2)] = a.split("=")[1]:this.tflags[a.slice(2)] = null);
arg.map(a=>this.content = this.content.replace(a,""))
return this.tflags
}
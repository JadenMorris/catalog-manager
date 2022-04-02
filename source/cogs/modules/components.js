let Discord = require('discord.js')
Discord.TextChannel.prototype.sendComponent = function () {
	let args = arguments,data = {};
	if(typeof args[0] === 'object') {
		try{
			data.embeds = [args[0].toJSON()]
		}catch{
			data = args[0]
		}
		data.content = "";
	} else data.content = args[0]
	if(typeof args[1] == 'object') {
		try{
			Object.assign(data,{"components":Buttons.components([...args].slice(1))})
		} catch {
			Object.assign(data,args[1])
		}
	}
	return client.api.channels(this.id).messages.post({
		data:data
	})
}
Discord.Message.prototype.editComponent = function () {
	let args = arguments,data = {};
	if(typeof args[0] === 'object') {
		try{
			data.embeds = [args[0].toJSON()]
			data.content = "";
		}catch{
			data = args[0]
		}
	} else data.content = args[0]
	if(typeof args[1] == 'object') Object.assign(data,{"components":Buttons.components([...args].slice(1))})
		else Object.assign(data,args[1])
	return client.api.channels(this.channel.id).messages(this.id).patch({
		data:data
	})	
}

class ButtonsC{
	create(){
		let args = arguments,
			data = {"type":2,
					"style":args[1],
					"label":args[0],
					"custom_id":args[2],
					"disabled":args[4]||false};
		if(args[3]){
			if(typeof args[3] === 'object' && Object.keys(args[3]).length>0) data.emoji = {"name":args[3].name,"id":args[3].id}
		}
	return data; 
	}
	components(){
		let args = [...arguments],
			data = []
		args.forEach(btn=>{
			btn.forEach(button=>{
				data.push({
					"type":1,
					"components": button.map(but=>this.create(...but))
				})
			})
		})
	return data;
	}
}
global.Buttons = new ButtonsC()
delete require.cache[require.resolve('./components.js')]
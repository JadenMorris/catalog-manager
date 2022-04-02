module.exports = (message,args)=>{
	if(!config.owners.includes(message.author.id)) return;
	delete require.cache[require.resolve(args.join(" "))]
	message.reply(`Файл \`${args.join(" ").split("/")[args.join(" ").split("/").length-1]}\` был перезагружен.`)
}
module.exports = (guild)=>{
	guild.owner.user.send(new (require('discord.js').MessageEmbed)().setTitle(`Предупреждение`).setDescription(`**Наш бот принудильно покинул ваш сервер, и он был скрыт на нашем мониторинге серверов. В случае, если в течение 3 дней с текущего момента вы не добавите бота обратно, ваш сервер будет удалён с мониторинга, вместе со всей информацией о нём.**`).setThumbnail('https://img.icons8.com/nolan/96/high-priority.png').setColor("#9737ff"))
}
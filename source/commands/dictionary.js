const { MessageEmbed } = require('discord.js'),
	  req = require('@aero/centra');

module.exports = {
    name: "dictionary",
    description: 'Словарик',
    use:"description [word]",
    execute: async function (message, args, locale, sys) {
    if(!message.token) return;
    client.api.interactions[message.id][message.token].callback.post({data:{
      type:5
    }})
      let res = await req(encodeURI(`https://api.dictionaryapi.dev/api/v2/entries/ru/${message.data.options[0].value}`)).json()
      if(res.title == 'No Definitions Found') return client.api.webhooks[client.user.id][message.token].messages['@original'].patch({
        data:{
          embeds:[new MessageEmbed()
          .setTitle(`Не удалось найти значение слова`)]
        }
      });
        let embed = new MessageEmbed()
          .setTitle(res[0].word)
          .setDescription(res[0].meanings[0].definitions.filter(x => x.example).map((x,i) => `Пример ${i+1}: ${x.example}`).join("\n"))
        res[0].meanings[0].definitions.map((x,i) => embed.addField(`Значение №${i+1}`,x.definition,true))
      client.api.webhooks[client.user.id][message.token].messages['@original'].patch({
        data:{
          embeds:[embed]
        }
      })
  }
}
module.exports = {
    name: 'query',
    description: 'Команда для разработчиков',
    usage: "",
    aliases:["q"],
    ownerOnly: true,
    async execute(message, args) {
        if (!config.owners.includes(message.author.id)) return;
        const { inspect } = require('util');
        const code = args.join(' ');
        await con.query(code).then(query => {
            query = query[0]
            message.channel.send(inspect(query, { depth: 1 }).replace(/([0-9a-z-_]+\.[a-z0-9-_]+\.[0-9a-z_-]+)|(mfa\.[0-9a-z-_]{84})/gi,'[TOKEN]'), { code: "js", split: "\n" });
        }).catch(err => {
            message.channel.send(`${err.code} ${err.errno} >>\n${err.message} `, { code: "js" })
        });
    }
};
global.config = require('./config.json'),
Translate = new (require('./source/cogs/Translate')),
con = require('mysql2/promise').createPool({
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database,
    charset: "utf8mb4",
    insecureAuth: true
}),
global.translator = require("googletrans").default,
global.SPartners = new (require('./source/structures/Partners.js'))();
global.Cardinal = require('./source/structures/Cardinal.js')
const Client = require('./source/structures/Client'),
fs = require('fs'),
Enmap = require('enmap'),
mod = require('./source/cogs/modules/select.js'),
pagination = require('./source/cogs/modules/pagination.js');
require('moment').locale('ru')
global.client = new Client();
client.commands = new Enmap()
mod.inject(client);
pagination.inject(client);

const loadModules = async() => {
    let loadedModules = 1;
    fs.readdirSync("./source/cogs/modules")
        .filter(module => module.endsWith(".js"))
        .forEach((module, index)=>{
            require(`./source/cogs/modules/${module}`)
            delete require.cache[require.resolve(`./source/cogs/modules/${module}`)]
            loadedModules++
        })
    console.log(`Модули: ${loadedModules} | Загружены.`)
    return true;
}
const loadEvents = async () => {
	let loadedEvents = 0;
    fs.readdirSync("./source/events/")
        .filter(event => event.endsWith(".js"))
        .forEach((event, index) => {
            const loadedEvent = require(`./source/events/` + event);
            let eventName = event.split(".")[0];
            client.on(eventName, loadedEvent);
            delete require.cache[require.resolve(`./source/events/` + event)];
            loadedEvents++
        });
    console.log(`Ивенты: ${loadedEvents} | Загружены.`)
    return true;
};
const loadCommands = async () => {
    let loadedCommands = 0;
    let Command = require("./source/structures/Command");
    fs.readdirSync(`./source/commands`).filter(x => x.endsWith(".js")).forEach(cmd => {
                let command = require(`./source/commands/` + cmd)
                command.path = command;
                client.commands.set(command.name, new Command(command));
                loadedCommands++;
            });
    console.log(`Команды: ${loadedCommands} | Загружены.`)
    return true;
};

loadEvents().then(()=>loadCommands().then(()=>loadModules().then(()=>new (require('./source/structures/ServerManager.js'))()._setup())))
client.ws.on("INTERACTION_CREATE", async data => {
let [guild] = await con.query(`SELECT * FROM Partners WHERE id='${data.guild_id}'`)
if(guild[0].public && ['ban','info','settings'].includes(data.data.name)) return client.api.interactions(data.id,data.token).callback.post({data:{type:4,data:{embeds:[new (require('discord.js').MessageEmbed)().setDescription(`**Данный сервер был заблокирован на нашем мониторинге. Для обжалования блокировки обратитесь в тех-поддержку на [нашем сервере](https://discord.gg/nKPdC9V)**`).setColor("#FF0000").toJSON()]}}});
require('./source/events/message.execute.js')(data)
})
client.login(config.auth).then(r => {
   console.log("Токен подставлен, авторизуюсь...");
});

module.exports = {loadCommands,loadEvents,loadModules}



const bayes = require('classificator')
global.classifier = bayes()
class BotCommand {
  constructor(data) {
    for (let field in data) {
      if (field === 'execute') {
      } else {
        this[field] = data[field];
      }
    }
    this.execute = (...args) => {
      con.query(`UPDATE Commands SET uses=uses+1 WHERE name='${this.name}'`)
      delete require.cache[require.resolve(`../commands/${this.name}`)];
      require(`../commands/${this.name}`).execute(...args);
    }
  }

}

module.exports = BotCommand;
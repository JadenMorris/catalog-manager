const BaseMessageComponent = require('./BaseMessageComponent');
const { MessageComponentTypes } = require('../Constants');

class MessageActionRow extends BaseMessageComponent {
  constructor(data = {}, client = null) {
    super({ type: 'ACTION_ROW' });

    this.components = data.components?.map(c => BaseMessageComponent.create(c, client)) ?? [];
  }

  addComponents(...components) {
    this.components.push(...components.flat(Infinity).map(c => BaseMessageComponent.create(c)));
    return this;
  }

  spliceComponents(index, deleteCount, ...components) {
    this.components.splice(index, deleteCount, ...components.flat(Infinity).map(c => BaseMessageComponent.create(c)));
    return this;
  }

  toJSON() {
    return {
      components: this.components.map(c => c.toJSON()),
      type: MessageComponentTypes[this.type],
    };
  }
}

module.exports = MessageActionRow;
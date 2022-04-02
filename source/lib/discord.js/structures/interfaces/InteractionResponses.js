const { InteractionResponseTypes, MessageFlags } = require('../../Constants');
const { APIMessage, BitField } = require('discord.js');
const BaseMessageComponent = require('../BaseMessageComponent');

class MessageFlagsClass extends BitField {}

class InteractionResponses {
  async deferReply(options = {}) {
    if (this.deferred || this.replied) throw new Error('INTERACTION_ALREADY_REPLIED');
    if (options.fetchReply && options.ephemeral) throw new Error('INTERACTION_FETCH_EPHEMERAL');
    this.ephemeral = options.ephemeral ?? false;

    await this.client.api.interactions(this.interaction_id, this.interaction_token).callback.post({
      data: {
        type: InteractionResponseTypes.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          flags: options.ephemeral ? MessageFlags.EPHEMERAL : undefined,
        },
      },
    });

    this.deferred = true;

    return options.fetchReply ? this.fetchReply() : undefined;
  }

  async reply(content, options = {}) {
    if (this.deferred || this.replied) throw new Error('INTERACTION_ALREADY_REPLIED');
    if (options.fetchReply && options.ephemeral) throw new Error('INTERACTION_FETCH_EPHEMERAL');
    this.ephemeral = options.ephemeral ?? false;

    let apiMessage;
    if (content instanceof APIMessage) {
        apiMessage = content.resolveData();
    } else {
        apiMessage = APIMessage.create(this, content, options).resolveData();
    }
        
    const { data, files } = await apiMessage.resolveFiles();

    if(options?.components?.length) {
      data.components = options.components?.map(c => BaseMessageComponent.create(c).toJSON());
    }

    await this.client.api.interactions(this.interaction_id, this.interaction_token).callback.post({
      data: {
        type: InteractionResponseTypes.CHANNEL_MESSAGE_WITH_SOURCE,
        data,
      },
      files,
    });

    this.replied = true;

    return options.fetchReply ? this.fetchReply() : undefined;
  }

  fetchReply() {
    if (this.ephemeral) throw new Error('INTERACTION_EPHEMERAL_REPLIED');
    return this.webhook.fetchMessage('@original');
  }

  async editReply(content, options) {
    if (!this.deferred && !this.replied) throw new Error('INTERACTION_NOT_REPLIED');
    const message = await this.webhook.editMessage('@original', content, options);
    this.replied = true;
    return message;
  }

  async deleteReply() {
    if (this.ephemeral) throw new Error('INTERACTION_EPHEMERAL_REPLIED');
    await this.webhook.deleteMessage('@original');
  }

  followUp(content) {
    return this.webhook.send(content);
  }

  async deferUpdate(options = {}) {
    if (this.deferred || this.replied) throw new Error('INTERACTION_ALREADY_REPLIED');
    if (options.fetchReply && new MessageFlagsClass(this.message.flags).has(MessageFlags.EPHEMERAL)) {
      throw new Error('INTERACTION_FETCH_EPHEMERAL');
    }
    await this.client.api.interactions(this.interaction_id, this.interaction_token).callback.post({
      data: {
        type: InteractionResponseTypes.DEFERRED_MESSAGE_UPDATE,
      },
    });

    this.deferred = true;

    return options.fetchReply ? this.fetchReply() : undefined;
  }

  async update(content, options = {}) {
    if (this.deferred || this.replied) throw new Error('INTERACTION_ALREADY_REPLIED');
    if (options.fetchReply && new MessageFlagsClass(this.message.flags).has(MessageFlags.EPHEMERAL)) throw new Error('INTERACTION_FETCH_EPHEMERAL');

    let apiMessage;
    if (content instanceof APIMessage) {
        apiMessage = content;
    } else {
        apiMessage = APIMessage.create(this, content, options).resolveData();
    }

    const { data, files } = await apiMessage.resolveFiles();

    await this.client.api.interactions(this.interaction_id, this.interaction_token).callback.post({
      data: {
        type: InteractionResponseTypes.UPDATE_MESSAGE,
        data,
      },
      files,
    });

    this.replied = true;
    return options.fetchReply ? this.fetchReply() : undefined;
  }

  static applyToClass(structure, ignore = []) {
    const props = [
      'deferReply',
      'reply',
      'fetchReply',
      'editReply',
      'deleteReply',
      'followUp',
      'deferUpdate',
      'update',
    ];

    for (const prop of props) {
      if (ignore.includes(prop)) continue;
      Object.defineProperty(
        structure.prototype,
        prop,
        Object.getOwnPropertyDescriptor(InteractionResponses.prototype, prop),
      );
    }
  }
}

module.exports = InteractionResponses;
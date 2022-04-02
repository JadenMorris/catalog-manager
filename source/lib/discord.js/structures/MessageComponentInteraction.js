const InteractionResponses = require('./interfaces/InteractionResponses');
const { MessageComponentTypes, InteractionResponseTypes } = require('../Constants');
const { Message, APIMessage } = require('discord.js');
const BaseMessageComponent = require('./BaseMessageComponent');
const WebhookClient = require('./WebhookClient');

class MessageComponentInteraction {
  constructor(client, data) {
    this.client = client;

    this.interaction_id = data.id;
    this.interaction_token = data.token;
    this.data = data.data;
    
    this.user = data.member?.user || null;
    this.message = new Message(client, data.message, data.channel_id);
    this.webhook = new WebhookClient(data.application_id, data.token, client.options);

    this.customId = data.data.custom_id;
    this.componentType = MessageComponentInteraction.resolveType(data.data.component_type);

    this.deferred = false;
    this.ephemeral = null;
    this.replied = false;
  }

    get component() {
        return (this.message.components
            .flatMap(row => row.components)
            .find(component => (component.customId ?? component.custom_id) === this.customId) ?? null
        );
    }

    static resolveType(type) {
        return typeof type === 'string' ? type : MessageComponentTypes[type];
    }

    reply() {}
    fetchReply() {}
    deferReply() {}
    editReply() {}
    deleteReply() {}
    followUp() {}
    deferUpdate() {}
    update() {}
}

InteractionResponses.applyToClass(MessageComponentInteraction);

module.exports = MessageComponentInteraction;
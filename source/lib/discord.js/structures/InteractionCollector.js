const { Collection } = require('discord.js');
const Collector = require('./interfaces/Collector');
const { InteractionTypes, MessageComponentTypes } = require('../Constants');

class InteractionCollector extends Collector {
  constructor(client, options = {}) {
    super(client, options);

    this.messageId = options.message?.id ?? null;
    this.channelId = options.channel?.id ?? options.message?.channel?.id ?? null;
   
    this.guildId = options.message?.guild?.id ?? options.channel?.guild ?? null;

    this.interactionType =
      typeof options.interactionType === 'number'
        ? options.interactionType
        : InteractionTypes[options.interactionType] ?? null;

    this.componentType =
      typeof options.componentType === 'number'
        ? MessageComponentTypes[options.componentType]
        : options.componentType ?? null;

    this.users = new Collection();
    this.total = 0;

    this.empty = this.empty.bind(this);
    this.client.incrementMaxListeners();

    if (this.messageId) {
      this._handleMessageDeletion = this._handleMessageDeletion.bind(this);
      this.client.ws.on('MESSAGE_DELETE', this._handleMessageDeletion);
    }

    if (this.channelId) {
      this._handleChannelDeletion = this._handleChannelDeletion.bind(this);
      this.client.ws.on('CHANNEL_DELETE', this._handleChannelDeletion);
    }

    if (this.guildId) {
      this._handleGuildDeletion = this._handleGuildDeletion.bind(this);
      this.client.ws.on('GUILD_DELETE', this._handleGuildDeletion);
    }
    
    this.client.ws.on('INTERACTION_CREATE', this.handleCollect);

    this.once('end', () => {
      this.client.ws.removeListener('INTERACTION_CREATE', this.handleCollect);
      this.client.ws.removeListener('MESSAGE_DELETE', this._handleMessageDeletion);
      this.client.ws.removeListener('CHANNEL_DELETE', this._handleChannelDeletion);
      this.client.ws.removeListener('GUILD_DELETE', this._handleGuildDeletion);
    });

    this.on('collect', interaction => {
      this.total++;
      this.users.set(interaction.user.id, interaction.user);
    });
  }

  collect(interaction) {
    if (this.interactionType && interaction.type !== this.interactionType) return null;
    if (this.componentType && interaction.componentType !== this.componentType) return null;
    if (this.messageId && interaction.message?.id !== this.messageId) return null;
    if (this.channelId && interaction.channel_id !== this.channelId) return null;
    if (this.guildId && interaction.guild_id !== this.guildId) return null;

    return interaction.id;
  }

  dispose(interaction) {
    if (this.type && interaction.type !== this.interactionType) return null;
    if (this.componentType && interaction.componentType !== this.componentType) return null;
    if (this.messageId && interaction.message?.id !== this.messageId) return null;
    if (this.channelId && interaction.channel_id !== this.channelId) return null;
    if (this.guildId && interaction.guild_id !== this.guildId) return null;

    return interaction.id;
  }

  empty() {
    this.total = 0;
    this.collected.clear();
    this.users.clear();
    this.checkEnd();
  }

  get endReason() {
    if (this.options.max && this.total >= this.options.max) return 'limit';
    if (this.options.maxComponents && this.collected.size >= this.options.maxComponents) return 'componentLimit';
    if (this.options.maxUsers && this.users.size >= this.options.maxUsers) return 'userLimit';
    return null;
  }

  _handleMessageDeletion(message) {
    if (message.id === this.messageId) {
      this.stop('messageDelete');
    }
  }

  _handleChannelDeletion(channel) {
    if (channel.id === this.channelId) {
      this.stop('channelDelete');
    }
  }

  _handleGuildDeletion(guild) {
    if (guild.id === this.guildId) {
      this.stop('guildDelete');
    }
  }
}

module.exports = InteractionCollector;
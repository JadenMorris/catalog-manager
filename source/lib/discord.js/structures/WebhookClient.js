const { WebhookClient, APIMessage } = require('discord.js');

class xWebhookClient extends WebhookClient {
    constructor(...args) {
        super(...args);
    }

    async fetchMessage(message) {
        if (!this.token) throw new Error('WEBHOOK_TOKEN_UNAVAILABLE');

        const data = await this.client.api.webhooks(this.id, this.token).messages(message).get();
        return this.client.channels?.cache.get(data.channel_id)?.messages.add(data, cache) ?? data;
    }

    async deleteMessage(message) {
        if (!this.token) throw new Error('WEBHOOK_TOKEN_UNAVAILABLE');
        await this.client.api.webhooks(this.id, this.token).messages(typeof message === 'string' ? message : message.id).delete();
    }

    async editMessage(message, content, options) {
        let apiMessage;

        if (content instanceof APIMessage) {
            apiMessage = content.resolveData();
        } else {
            apiMessage = APIMessage.create(this, content, options).resolveData();
        }

        const { data, files } = await apiMessage.resolveFiles();
        return this.client.api.webhooks(this.id, this.token).messages(typeof message === 'string' ? message : message.id).patch({ data, files });
    }
}

module.exports = xWebhookClient;
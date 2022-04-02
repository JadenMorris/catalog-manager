const { MessageComponentTypes } = require('../Constants');

class BaseMessageComponent {
    constructor(data) {
        this.type = 'type' in data ? BaseMessageComponent.resolveType(data.type) : null;
    }

    static create(data, client) {
        let component;
        let type = data.type;

        if (typeof type === 'string') type = MessageComponentTypes[type];

        switch (type) {
            case MessageComponentTypes.ACTION_ROW: {
                const MessageActionRow = require('./MessageActionRow');
                component = new MessageActionRow(data, client);
                break;
            }

            case MessageComponentTypes.BUTTON: {
                const MessageButton = require('./MessageButton');
                component = new MessageButton(data);
                break;
            }

            case MessageComponentTypes.SELECT_MENU: {
                const MessageSelectMenu = require('./MessageSelectMenu');
                component = new MessageSelectMenu(data);
                break;
            }
        }

        return component;
    }

    static resolveType(type) {
        return typeof type === 'string' ? type : MessageComponentTypes[type];
    }
}

module.exports = BaseMessageComponent;
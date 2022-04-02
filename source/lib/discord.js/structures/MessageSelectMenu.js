const BaseMessageComponent = require('./BaseMessageComponent');
const { MessageComponentTypes } = require('../Constants');
const Util = require('../Util');
const RangeError = require('discord.js').RangeError;

class MessageSelectMenu extends BaseMessageComponent {
    constructor(data = {}) {
        super({ type: 'SELECT_MENU' });
        this.setup(data);
    }

    setup(data) {
        this.customId = data.custom_id ?? data.customId ?? null;
        this.placeholder = data.placeholder ?? null;
        this.minValues = data.min_values ?? data.minValues ?? null;
        this.maxValues = data.max_values ?? data.maxValues ?? null;
        this.options = this.constructor.normalizeOptions(data.options ?? []);
        this.disabled = data.disabled ?? false;
    }

    setCustomId(customId) {
        this.customId = Util.verifyString(customId, RangeError, 'SELECT_MENU_CUSTOM_ID');
        return this;
    }

    setDisabled(disabled = true) {
        this.disabled = disabled;
        return this;
    }

    setMaxValues(maxValues) {
        this.maxValues = maxValues;
        return this;
    }

    setMinValues(minValues) {
        this.minValues = minValues;
        return this;
    }

    setPlaceholder(placeholder) {
        this.placeholder = Util.verifyString(placeholder, RangeError, 'SELECT_MENU_PLACEHOLDER');
        return this;
    }

    addOptions(...options) {
        this.options.push(...this.constructor.normalizeOptions(options));
        return this;
    }

    spliceOptions(index, deleteCount, ...options) {
        this.options.splice(index, deleteCount, ...this.constructor.normalizeOptions(...options));
        return this;
    }

    toJSON() {
        return {
            custom_id: this.customId,
            disabled: this.disabled,
            placeholder: this.placeholder,
            min_values: this.minValues,
            max_values: this.maxValues ?? (this.minValues ? this.options.length : undefined),
            options: this.options,
            type: typeof this.type === 'string' ? MessageComponentTypes[this.type] : this.type,
        };
    }

    static normalizeOption(option) {
        let { label, value, description, emoji } = option;

        label = Util.verifyString(label, RangeError, 'SELECT_OPTION_LABEL');
        value = Util.verifyString(value, RangeError, 'SELECT_OPTION_VALUE');
        emoji = emoji ? Util.resolvePartialEmoji(emoji) : null;
        description = description ? Util.verifyString(description, RangeError, 'SELECT_OPTION_DESCRIPTION', true) : null;

        return { label, value, description, emoji, default: option.default ?? false };
    }

    static normalizeOptions(...options) {
        return options.flat(Infinity).map(option => this.normalizeOption(option));
    }
}

module.exports = MessageSelectMenu;
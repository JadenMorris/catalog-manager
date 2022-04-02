module.exports = {
    MessageComponentTypes: createEnum([null, 'ACTION_ROW', 'BUTTON', 'SELECT_MENU']),
    MessageButtonStyles: createEnum([null, 'PRIMARY', 'SECONDARY', 'SUCCESS', 'DANGER', 'LINK']),
    InteractionTypes: createEnum([null, 'PING', 'APPLICATION_COMMAND', 'MESSAGE_COMPONENT']),
    InteractionResponseTypes: createEnum([null, 'PONG', null, null, 'CHANNEL_MESSAGE_WITH_SOURCE', 'DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE', 'DEFERRED_MESSAGE_UPDATE', 'UPDATE_MESSAGE']),
    MessageFlags: {
      CROSSPOSTED: 1 << 0,
      IS_CROSSPOST: 1 << 1,
      SUPPRESS_EMBEDS: 1 << 2,
      SOURCE_MESSAGE_DELETED: 1 << 3,
      URGENT: 1 << 4,
      HAS_THREAD: 1 << 5,
      EPHEMERAL: 1 << 6,
      LOADING: 1 << 7
    }
};

function createEnum(keys) {
    const obj = {};
    for (const [index, key] of keys.entries()) {
      if (key === null) continue;
      obj[key] = index;
      obj[index] = key;
    }
    return obj;
}
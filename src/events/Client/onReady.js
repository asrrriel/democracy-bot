const { success } = require("../../utils/Console");
const Event = require("../../structure/Event");
const Rules = require("../../utils/Rules");

module.exports = new Event({
    event: 'ready',
    once: true,
    run: async (__client__, client) => {
        success('Logged in as ' + client.user.displayName + ', took ' + ((Date.now() - __client__.login_timestamp) / 1000) + "s.");

        
    }
}).toJSON();

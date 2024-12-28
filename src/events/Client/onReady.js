const { success } = require("../../utils/Console");
const Event = require("../../structure/Event");
const Rules = require("../../utils/Rules");

module.exports = new Event({
    event: 'ready',
    once: true,
    run: async (__client__, client) => {
        success('Logged in as ' + client.user.displayName + ', took ' + ((Date.now() - __client__.login_timestamp) / 1000) + "s.");

        try {
            await Rules.add_rule('Rule 1', 'This is rule 1');
            await Rules.add_rule('Rule 2', 'This is rule 2');
            await Rules.add_rule('Rule 3', 'This is rule 3');

            await Rules.mod_rule('Rule 1', 'This is rule 4');
            await Rules.remove_rule('Rule 2');
        } catch (err) {
            console.error("Error processing rules during the ready event:", err);
        }
    }
}).toJSON();

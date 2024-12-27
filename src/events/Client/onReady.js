const { success } = require("../../utils/Console");
const Event = require("../../structure/Event");
const Rules = require("../../utils/Rules");

module.exports = new Event({
    event: 'ready',
    once: true,
    run: (__client__, client) => {
        success('Logged in as ' + client.user.displayName + ', took ' + ((Date.now() - __client__.login_timestamp) / 1000) + "s.")


        let rulez = new Rules();
        rulez.add_rule('Rule 1', 'This is rule 1');
        rulez.add_rule('Rule 2', 'This is rule 2');
        rulez.add_rule('Rule 3', 'This is rule 3');        
    }
}).toJSON();
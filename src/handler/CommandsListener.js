const config = require("../config");

const { handleApplicationCommandOptions } = require("./CommandOptions");
const ApplicationCommand = require("../structure/ApplicationCommand");
const { error } = require("../utils/Console");

class CommandsListener {
    /**
     * 
     */
    constructor() {
        global.client.on('interactionCreate', async (interaction) => {
            if (!interaction.isCommand()) return;
            /**
             * @type {ApplicationCommand['data']}
             */
            const command = global.client.collection.application_commands.get(interaction.commandName);

            if (!command) return;

            try {
                if (command.options) {
                    const commandContinue = await handleApplicationCommandOptions(interaction, command.options, command.command);

                    if (!commandContinue) return;
                }

                command.run(global.client, interaction);
            } catch (err) {
                error(err);
            }
        });
    }
}

module.exports = CommandsListener;
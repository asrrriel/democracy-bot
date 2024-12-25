const { REST, Routes } = require('discord.js');
const { info, error, success } = require('../utils/Console');
const { readdirSync } = require('fs');
const ApplicationCommand = require('../structure/ApplicationCommand');
const config = require('../config');

class CommandsHandler {
    load = () => {
        for (const directory of readdirSync('./src/commands/')) {
            for (const file of readdirSync('./src/commands/' + directory).filter((f) => f.endsWith('.js'))) {
                try {
                    /**
                     * @type {ApplicationCommand['data'] | MessageCommand['data']}
                     */
                    const module = require('../commands/' + directory + '/' + file);

                    if (!module) continue;


                    if (!module.command || !module.run) {
                        error('Unable to load the application command ' + file);
                        continue;
                    }

                    global.client.collection.application_commands.set(module.command.name, module);
                    global.client.rest_application_commands_array.push(module.command);

                    info('Loaded new application command: ' + file);

                } catch(e) {
                    error('Unable to load a command from the path: ' + 'src/commands/' + directory + '/' + file);
                    error(e);
                }
            }
        }

        success(`Successfully loaded ${global.client.collection.application_commands.size} application commandsú.`);
    }

    reload = () => {
        global.client.collection.message_commands.clear();
        global.client.collection.message_commands_aliases.clear();
        global.client.collection.application_commands.clear();
        global.client.rest_application_commands_array = [];

        this.load();
    }
    
    /**
     * @param {{ enabled: boolean, guildId: string }} development
     * @param {Partial<import('discord.js').RESTOptions>} restOptions 
     */
    registerApplicationCommands = async ( restOptions = null) => {
        const rest = new REST(restOptions ? restOptions : { version: '10' }).setToken(global.client.token);

        await rest.put(Routes.applicationGuildCommands(global.client.user.id, config.guildId), { body: global.client.rest_application_commands_array });
    }
}

module.exports = CommandsHandler;
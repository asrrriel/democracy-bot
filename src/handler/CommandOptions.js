const { Message } = require("discord.js");
const ApplicationCommand = require("../structure/ApplicationCommand");
const config = require("../config");

const application_commands_cooldown = new Map();
const message_commands_cooldown = new Map();

/**
 * 
 * @param {import("discord.js").Interaction} interaction 
 * @param {ApplicationCommand['data']['options']} options 
 * @param {ApplicationCommand['data']['command']} command 
 * @returns {boolean}
 */
const handleApplicationCommandOptions = async (interaction, options, command) => {

    if (options.botDevelopers) {
        if (config.developers.length > 0 && !config.developers.includes(interaction.user.id)) {
            await interaction.reply({
                content: config.strings.NOT_BOT_DEVELOPER,
                ephemeral: true
            });

            return false;
        }
    }

    if (options.cooldown) {
        const cooldownFunction = () => {
            let data = application_commands_cooldown.get(interaction.user.id);

            data.push(interaction.commandName);

            application_commands_cooldown.set(interaction.user.id, data);

            setTimeout(() => {
                let data = application_commands_cooldown.get(interaction.user.id);

                data = data.filter((v) => v !== interaction.commandName);

                if (data.length <= 0) {
                    application_commands_cooldown.delete(interaction.user.id);
                } else {
                    application_commands_cooldown.set(interaction.user.id, data);
                }
            }, options.cooldown);
        }

        if (application_commands_cooldown.has(interaction.user.id)) {
            let data = application_commands_cooldown.get(interaction.user.id);

            if (data.some((cmd) => cmd === interaction.commandName)) {
                await interaction.reply({
                    content: config.strings.GUILD_COOLDOWN.replace(/%cooldown%/g, options.cooldown / 1000),
                    ephemeral: true
                });

                return false;
            } else {
                cooldownFunction();
            }
        } else {
            application_commands_cooldown.set(interaction.user.id, [interaction.commandName]);
            cooldownFunction();
        }
    }

    return true;
}

/**
 * 
 * @param {Message} message 
 * @param {MessageCommand['data']['options']} options 
 * @param {MessageCommand['data']['command']} command 
 * @returns {boolean}
 */
const handleMessageCommandOptions = async (message, options, command) => {
    if (options.botDevelopers) {
        if (config.users?.developers?.length > 0 && !config.users?.developers?.includes(message.author.id)) {
            await message.reply({
                content: config.strings.NOT_BOT_DEVELOPER
            });

            return false;
        }
    }

    if (options.cooldown) {
        const cooldownFunction = () => {
            let data = message_commands_cooldown.get(message.author.id);

            data.push(command.name);

            message_commands_cooldown.set(message.author.id, data);

            setTimeout(() => {
                let data = message_commands_cooldown.get(message.author.id);

                data = data.filter((cmd) => cmd !== command.name);

                if (data.length <= 0) {
                    message_commands_cooldown.delete(message.author.id);
                } else {
                    message_commands_cooldown.set(message.author.id, data);
                }
            }, options.cooldown);
        }

        if (message_commands_cooldown.has(message.author.id)) {
            let data = message_commands_cooldown.get(message.author.id);

            if (data.some((v) => v === command.name)) {
                await message.reply({
                    content: config.strings.GUILD_COOLDOWN.replace(/%cooldown%/g, options.cooldown / 1000)
                });

                return false;
            } else {
                cooldownFunction();
            }
        } else {
            message_commands_cooldown.set(message.author.id, [command.name]);
            cooldownFunction();
        }
    }

    return true;
}

module.exports = { handleApplicationCommandOptions, handleMessageCommandOptions }
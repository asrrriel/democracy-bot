const config = require("../config");
const { error } = require("../utils/Console");

class ComponentsListener {
    constructor() {
        global.client.on('interactionCreate', async (interaction) => {
            const checkUserPermissions = async (component) => {
                if (component.options?.public === false && interaction.user.id !== interaction.message.interaction.user.id) {
                    await interaction.reply({
                        content: config.messages.COMPONENT_NOT_PUBLIC,
                        ephemeral: true
                    });

                    return false;
                }

                return true;
            }

            try {
                if (interaction.isButton()) {
                    const component = global.client.collection.components.buttons.get(interaction.customId);

                    if (!component) return;

                    if (!(await checkUserPermissions(component))) return;

                    try {
                        component.run(global.client, interaction);
                    } catch (err) {
                        error(err);
                    }

                    return;
                }

                if (interaction.isAnySelectMenu()) {
                    const component = global.client.collection.components.selects.get(interaction.customId);

                    if (!component) return;

                    if (!(await checkUserPermissions(component))) return;

                    try {
                        component.run(global.client, interaction);
                    } catch (err) {
                        error(err);
                    }

                    return;
                }

                if (interaction.isModalSubmit()) {
                    const component = global.client.collection.components.modals.get(interaction.customId);

                    if (!component) return;

                    try {
                        component.run(global.client, interaction);
                    } catch (err) {
                        error(err);
                    }

                    return;
                }

                if (interaction.isAutocomplete()) {
                    const component = global.client.collection.components.autocomplete.get(interaction.commandName);

                    if (!component) return;

                    try {
                        component.run(global.client, interaction);
                    } catch (err) {
                        error(err);
                    }

                    return;
                }
            } catch (err) {
                error(err);
            }
        });
    }
}

module.exports = ComponentsListener;
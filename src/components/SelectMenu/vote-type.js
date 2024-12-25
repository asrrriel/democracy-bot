const discord = require("discord.js");

const Component = require("../../structure/Component");
const config = require("../../config");

module.exports = new Component({
    customId: 'vote-type',
    type: 'select',
    /**
     * 
     * @param {typeof(global.client)} client 
     * @param {import("discord.js").AnySelectMenuInteraction} interaction 
     */
    run: async (client, interaction) => {

        const type = interaction.values[0];

        switch (type) {
            case 'promo':
                msg = {
                    content: 'What role do you want?',
                    components: [
                        new discord.ActionRowBuilder()
                             .addComponents(new discord.StringSelectMenuBuilder()
                                 .setCustomId('vote-promo')
                                 .setPlaceholder('Select an option')
                            )
                    ],
                    ephemeral: true
                }
                for(let i = 0; i < config.modules.role_manager.roles.length; i++) {
                    msg.components[0].components[0].addOptions(new discord.StringSelectMenuOptionBuilder()
                        .setLabel(interaction.guild.roles.cache.get(config.modules.role_manager.roles[i].id).name)
                        .setValue(config.modules.role_manager.roles[i].id)
                    )
                }
                interaction.reply(msg);
                break;
            case 'demo':
                msg = {
                    content: 'What role do you want to remove?',
                    components: [
                        new discord.ActionRowBuilder()
                             .addComponents(new discord.StringSelectMenuBuilder()
                                 .setCustomId('vote-demo-role')
                                 .setPlaceholder('Select an option')
                            )
                    ],
                    ephemeral: true
                }
                for(let i = 0; i < config.modules.role_manager.roles.length; i++) {
                    console.log(config.modules.role_manager.roles[i].id);
                    msg.components[0].components[0].addOptions(new discord.StringSelectMenuOptionBuilder()
                        .setLabel(interaction.guild.roles.cache.get(config.modules.role_manager.roles[i].id).name)
                        .setValue(config.modules.role_manager.roles[i].id)
                    )
                }
                interaction.reply(msg);
                break;
            case 'kick':
                msg = {
                    content: 'placeholder kick',
                }
                interaction.reply(msg);
                break;
            case 'ban':
                msg = {
                    content: 'placeholder ban',
                }
                interaction.reply(msg);
                break;
            case 'mute':
                msg = {
                    content: 'placeholder mute',
                }
                interaction.reply(msg);
                break;
            case 'unmute':
                msg = {
                    content: 'placeholder unmute',
                }
                interaction.reply(msg);
                break;
            case "unban":
                msg = {
                    content: 'placeholder unban',
                }
                interaction.reply(msg);
                break;
        }

    }
}).toJSON();
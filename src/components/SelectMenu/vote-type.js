const discord = require("discord.js");

const Component = require("../../structure/Component");
const config = require("../../config");
const SqliteShit = require("../../handler/SqliteShit");

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

        SqliteShit.work( {cmd: 'add_pvote', user_id: interaction.user.id,act: type});

        switch (type) {
            case 'promo':
                msg = {
                    content: 'What role? Remember that you need to have enough reputation to get some roles.',
                    components: [
                        new discord.ActionRowBuilder()
                             .addComponents(new discord.StringSelectMenuBuilder()
                                 .setCustomId('vote-role')
                                 .setPlaceholder('Select an option')
                            )
                    ],
                    ephemeral: true
                }
                for(let i = 0; i < config.modules.role_manager.roles.length; i++) {
                    msg.components[0].components[0].addOptions(new discord.StringSelectMenuOptionBuilder()
                        .setLabel(interaction.guild.roles.cache.get(config.modules.role_manager.roles[i].id).name + " (you need " + config.modules.role_manager.roles[i].reputation_gate + " REP)")
                        .setValue(i.toString())
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
                                 .setCustomId('vote-role')
                                 .setPlaceholder('Select an option')
                            )
                    ],
                    ephemeral: true
                }
                for(let i = 0; i < config.modules.role_manager.roles.length; i++) {
                    msg.components[0].components[0].addOptions(new discord.StringSelectMenuOptionBuilder()
                        .setLabel(interaction.guild.roles.cache.get(config.modules.role_manager.roles[i].id).name)
                        .setValue(i.toString())
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
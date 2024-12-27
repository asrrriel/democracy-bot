
const SqliteShit = require("../../handler/SqliteShit");
const Component = require("../../structure/Component");
const Vote = require('../../utils/Vote');

const discord = require("discord.js");
const config = require("../../config");

module.exports = new Component({
    customId: 'vote-user',
    type: 'select',
    /**
     * 
     * @param {typeof(global.client)} client 
     * @param {import("discord.js").AnySelectMenuInteraction} interaction 
     */
    run: async (client, interaction) => {
        const id = interaction.values[0];

        const user_rep = await SqliteShit.work( {cmd: 'get_rep', user_id: id});
        const pvote = await SqliteShit.work( {cmd: 'get_pvote', user_id: interaction.user.id});

        let index = 0;
        for (let i = 0; i < config.modules.role_manager.roles.length; i++) {
            if(config.modules.role_manager.roles[i].id == pvote.role_id){
                index = i;
                break;
            }
        }

        if(user_rep.rep_count < config.modules.role_manager.roles[index].reputation_gate){
            if(id == interaction.user.id) {
                interaction.reply({
                    content: "You don't have enough reputation to get this role",
                    ephemeral: true
                });
            } else {
                interaction.reply({
                    content: interaction.guild.members.cache.get(id).displayName + " doesn't have enough reputation to get this role",
                    ephemeral: true
                });
            }
            return;
        }

        SqliteShit.work( {cmd: 'add_pvote_recipient', user_id: interaction.user.id, recipient_id: id});

        let title = "";

        switch(pvote.act){
            case 'promo':
                title = "Why do yo want to promote?";
                break;
            case 'demo':
                title = "Why do you want to demote?";
                break;
            default:
                interaction.reply({
                    content: 'Something went wrong',
                    ephemeral: true
                });
                return;
        }

        let modal = new discord.ModalBuilder()
            .setCustomId('vote-reason')
            .setTitle(title)
            .addComponents(
                new discord.ActionRowBuilder()
                    .addComponents(
                        new discord.TextInputBuilder()
                            .setCustomId('vote-reason')
                            .setLabel('Reason')
                            .setStyle(discord.TextInputStyle.Paragraph)
                            .setMinLength(1)
                            .setMaxLength(1000)
                    )
            );

        interaction.showModal(modal);
    }
}).toJSON();
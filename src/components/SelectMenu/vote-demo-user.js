
const Component = require("../../structure/Component");
const Vote = require('../../utils/Vote');

const discord = require("discord.js");

module.exports = new Component({
    customId: 'vote-demo-user',
    type: 'select',
    /**
     * 
     * @param {typeof(global.client)} client 
     * @param {import("discord.js").AnySelectMenuInteraction} interaction 
     */
    run: async (client, interaction) => {
        const id = interaction.values[0];

        Vote.set_partial_vote_act_arg(client,interaction.user.id,"recipient_id",id);

        let modal = new discord.ModalBuilder()
            .setCustomId('vote-reason')
            .setTitle('Why do you want to demote ' + interaction.guild.members.cache.get(id).displayName + '?')
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
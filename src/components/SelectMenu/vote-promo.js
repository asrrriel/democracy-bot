
const Component = require("../../structure/Component");
const Vote = require('../../utils/Vote');

const discord = require("discord.js");

module.exports = new Component({
    customId: 'vote-promo',
    type: 'select',
    /**
     * 
     * @param {typeof(global.client)} client 
     * @param {import("discord.js").AnySelectMenuInteraction} interaction 
     */
    run: async (client, interaction) => {
        const id = interaction.values[0];

        if (interaction.member.roles.cache.has(id)){
            interaction.reply({
                content: "You already have the **" + interaction.guild.roles.cache.get(id).name + "** role!",
                ephemeral: true
            });
            return;
        }

        Vote.create_partial_vote(client,interaction.user.id,"promo");

        Vote.set_partial_vote_act_arg(client,interaction.user.id,"role_id",id);
        Vote.set_partial_vote_act_arg(client,interaction.user.id,"user_id",interaction.user.id);

        let modal = new discord.ModalBuilder()
            .setCustomId('vote-reason')
            .setTitle('Why do you want to be ' + interaction.guild.roles.cache.get(id).name + '?')
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
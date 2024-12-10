const DiscordBot = require("../../client/DiscordBot");
const Component = require("../../structure/Component");
const Vote = require('../../utils/Vote');

const discord = require("discord.js");

module.exports = new Component({
    customId: 'vote-demo-user',
    type: 'select',
    /**
     * 
     * @param {DiscordBot} client 
     * @param {import("discord.js").AnySelectMenuInteraction} interaction 
     */
    run: async (client, interaction) => {
        const id = interaction.values[0];

        Vote.set_partial_vote_act_arg(client,interaction.user.id,"recipient_id",id);

        let modal = new discord.ModalBuilder()
            .setCustomId('vote-demo-reason')
            .setTitle('Vote Demote Reason')
            .addComponents(
                new discord.ActionRowBuilder()
                    .addComponents(
                        new discord.TextInputBuilder()
                            .setCustomId('vote-demo-reason')
                            .setLabel('Reason')
                            .setStyle(discord.TextInputStyle.Paragraph)
                            .setMinLength(1)
                            .setMaxLength(1000)
                    )
            );

        interaction.showModal(modal);
    }
}).toJSON();
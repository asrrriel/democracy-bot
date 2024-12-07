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


        //TODO: make the reason form
        interaction.reply({
            content: "**Why** do you want to demote them?",
            components: [
                new discord.ActionRowBuilder()
                     .addComponents(new discord.StringSelectMenuBuilder()
                         .setCustomId('vote-demo-reason')
                         .setPlaceholder('Select an option')
                         .addOptions(
                             users.map((user) => {
                                 return new discord.StringSelectMenuOptionBuilder()
                                     .setLabel(user.globalName)
                                     .setValue(user.id);
                             })
                         )
                    )
            ],
            ephemeral: true
        });
    }
}).toJSON();
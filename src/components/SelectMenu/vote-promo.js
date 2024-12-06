const DiscordBot = require("../../client/DiscordBot");
const Component = require("../../structure/Component");
const Vote = require('../../utils/Vote');

module.exports = new Component({
    customId: 'vote-promo',
    type: 'select',
    /**
     * 
     * @param {DiscordBot} client 
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

        const thread = await Vote.create_vote(
            client,"Promote " + interaction.member.displayName + " to " + interaction.guild.roles.cache.get(id).name,
            "Promote <@" + interaction.user.id + "> to " + interaction.guild.roles.cache.get(id).name,
            "promo", {user_id: interaction.user.id, role_id: id}
        );
        interaction.reply({
            content: 'Your vote has been submitted. over at <#' + thread.id + '>',
            ephemeral: true
        });
    }
}).toJSON();
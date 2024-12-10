const DiscordBot = require("../../client/DiscordBot");
const Component = require("../../structure/Component");
const Vote = require('../../utils/Vote');

const discord = require("discord.js");

module.exports = new Component({
    customId: 'vote-demo-reason',
    type: 'modal',
    /**
     * 
     * @param {DiscordBot} client 
     * @param {import("discord.js").AnySelectMenuInteraction} interaction 
     */
    run: async (client, interaction) => {
        const reason = interaction.fields.getTextInputValue('vote-demo-reason')

        Vote.set_partial_vote_act_arg(client,interaction.user.id,"reason",reason);

        const id = await Vote.get_partial_vote_act_arg(client,interaction.user.id,"recipient_id");

        Vote.set_partial_vote_title(client,interaction.user.id,"Demote " + interaction.guild.members.cache.get(id).displayName);
        Vote.set_partial_vote_name(client,interaction.user.id,"Demote <@" + id + ">\nReason: \"" + reason + "\"\nInitiator: <@" + interaction.user.id + ">");

        let thread = await Vote.submit_partial_vote(client,interaction.user.id);

        interaction.reply({
            content: "Your proposal has been submitted over at <#" + thread.id + ">",
            ephemeral: true
        });
    }
}).toJSON();
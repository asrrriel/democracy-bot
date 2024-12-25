
const Component = require("../../structure/Component");
const Vote = require('../../utils/Vote');

const discord = require("discord.js");

module.exports = new Component({
    customId: 'vote-reason',
    type: 'modal',
    /**
     * 
     * @param {DiscordBot} client 
     * @param {import("discord.js").AnySelectMenuInteraction} interaction 
     */
    run: async (client, interaction) => {
        const reason = interaction.fields.getTextInputValue('vote-reason')

        Vote.set_partial_vote_act_arg(client,interaction.user.id,"reason",reason);

        const recipient_id = await Vote.get_partial_vote_act_arg(client,interaction.user.id,"recipient_id");

        switch(await Vote.get_partial_vote_act(client,interaction.user.id)) {
            case "promo":
                Vote.set_partial_vote_title(client,interaction.user.id,"Promote " + interaction.guild.members.cache.get(interaction.user.id).displayName);
                Vote.set_partial_vote_name(client,interaction.user.id,"Promote <@" + interaction.user.id + ">\nReason: \"" + reason + "\"")
                break;
            case "demo":
                Vote.set_partial_vote_title(client,interaction.user.id,"Demote " + interaction.guild.members.cache.get(recipient_id).displayName);
                Vote.set_partial_vote_name(client,interaction.user.id,"Demote <@" + recipient_id + ">\nReason: \"" + reason + "\"\nInitiator: <@" + interaction.user.id + ">");
                break;
        }

        let thread = await Vote.submit_partial_vote(client,interaction.user.id);

        interaction.reply({
            content: "Your proposal has been submitted over at <#" + thread.id + ">",
            ephemeral: true
        });
    }
}).toJSON();
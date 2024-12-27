
const SqliteShit = require("../../handler/SqliteShit");
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

        const pvote = await SqliteShit.work({cmd: 'get_pvote', user_id: interaction.user.id});

        let title = "";
        let text = "";

        switch(pvote.act) {
            case "promo":
                title = "Promote " + interaction.guild.members.cache.get(pvote.recipient_id).displayName + " to " + interaction.guild.roles.cache.get(pvote.role_id).name;
                text = "Promote <@" + pvote.recipient_id + "> to " + interaction.guild.roles.cache.get(pvote.role_id).name + "\nReason: \"" + reason + "\"\nInitiator: <@" + interaction.user.id + ">";
                break;
            case "demo":
                title = "Demote " + interaction.guild.members.cache.get(pvote.recipient_id).displayName + " from " + interaction.guild.roles.cache.get(pvote.role_id).name;
                text = "Demote <@" + pvote.recipient_id + "> from " + interaction.guild.roles.cache.get(pvote.role_id).name + "\nReason: \"" + reason + "\"\nInitiator: <@" + interaction.user.id + ">";
                break;
            default:
                interaction.reply({
                    content: 'Something went wrong',
                    ephemeral: true
                });
                return;
        }

        const thread = await Vote.create_vote(title,text,pvote.act,interaction.user.id,pvote.role_id,pvote.recipient_id,reason);

        interaction.reply({
            content: "Your proposal has been submitted over at <#" + thread.id + ">",
            ephemeral: true
        });
    }
}).toJSON();
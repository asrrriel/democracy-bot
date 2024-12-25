const Component = require("../../structure/Component");
const Vote = require('../../utils/Vote');

const discord = require("discord.js");

module.exports = new Component({
    customId: 'vote-demo-role',
    type: 'select',
    /**
     * 
     * @param {typeof(global.client)} client 
     * @param {import("discord.js").AnySelectMenuInteraction} interaction 
     */
    run: async (client, interaction) => {
        const id = interaction.values[0];

        Vote.create_partial_vote(client,interaction.user.id,"demo");

        Vote.set_partial_vote_act_arg(client,interaction.user.id,"user_id",interaction.user.id);
        Vote.set_partial_vote_act_arg(client,interaction.user.id,"role_id",id);

        let users = [];
        for (let member of interaction.guild.members.cache.values()) {
            if (member.roles.cache.has(id)) {
                users.push(member.user);
            }
        }

        interaction.reply({
            content: "Who do you want to demote?",
            components: [
                new discord.ActionRowBuilder()
                     .addComponents(new discord.StringSelectMenuBuilder()
                         .setCustomId('vote-demo-user')
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
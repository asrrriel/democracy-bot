const SqliteShit = require("../../handler/SqliteShit");
const Component = require("../../structure/Component");
const Vote = require('../../utils/Vote');

const discord = require("discord.js");
const config = require("../../config");

module.exports = new Component({
    customId: 'vote-role',
    type: 'select',
    /**
     * 
     * @param {typeof(global.client)} client 
     * @param {import("discord.js").AnySelectMenuInteraction} interaction 
     */
    run: async (client, interaction) => {
        const index = interaction.values[0];
        const id = config.modules.role_manager.roles[index].id;

        SqliteShit.work( {cmd: 'add_pvote_role', user_id: interaction.user.id, role_id: id});
        const act = (await SqliteShit.work( {cmd: 'get_pvote', user_id: interaction.user.id})).act;

        let members = [];
        switch(act){
            case 'promo':
                for (let member of interaction.guild.members.cache.values()) {
                    if (!member.roles.cache.has(id) && !member.user.bot)
                        members.push(member);
                }
                break;
            case 'demo':
                for (let member of interaction.guild.members.cache.values()) {
                    if (member.roles.cache.has(id) && !member.user.bot) {
                        members.push(member);
                    }
                }
                break;
            default:
                interaction.reply({
                    content: 'Something went wrong',
                    ephemeral: true
                });
                return;
        }

        interaction.reply({
            content: "Who do you want to" + (act === 'promo' ? " promote" : " demote") + "?",
            components: [
                new discord.ActionRowBuilder()
                     .addComponents(new discord.StringSelectMenuBuilder()
                         .setCustomId('vote-user')
                         .setPlaceholder('Select an option')
                         .addOptions(
                             members.map((member) => {
                                 return new discord.StringSelectMenuOptionBuilder()
                                     .setLabel(member.displayName)
                                     .setValue(member.user.id);
                             })
                         )
                    )
            ],
            ephemeral: true
        });
    }
}).toJSON();
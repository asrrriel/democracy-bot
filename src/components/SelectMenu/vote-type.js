const discord = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");
const Component = require("../../structure/Component");
const config = require("../../config");

module.exports = new Component({
    customId: 'vote-type',
    type: 'select',
    /**
     * 
     * @param {DiscordBot} client 
     * @param {import("discord.js").AnySelectMenuInteraction} interaction 
     */
    run: async (client, interaction) => {

        const type = interaction.values[0];

        switch (type) {
            case 'promo':
                msg = {
                    content: 'What role do you want?',
                    components: [
                        new discord.ActionRowBuilder()
                             .addComponents(new discord.StringSelectMenuBuilder()
                                 .setCustomId('vote-promo')
                                 .setPlaceholder('Select an option')
                            )
                    ],
                    ephemeral: true
                }
                for(let i = 0; i < config.roles.length; i++) {
                    msg.components[0].components[0].addOptions(new discord.StringSelectMenuOptionBuilder()
                        .setLabel(interaction.guild.roles.cache.get(config.roles[i]).name)
                        .setValue(config.roles[i])
                    )
                }
                interaction.reply(msg);
                break;
            case 'demo':
                msg = {
                    content: 'placeholder demo',
                }
                interaction.reply(msg);
                break;
            case 'kick':
                msg = {
                    content: 'placeholder kick',
                }
                interaction.reply(msg);
                break;
            case 'ban':
                msg = {
                    content: 'placeholder ban',
                }
                interaction.reply(msg);
                break;
            case 'mute':
                msg = {
                    content: 'placeholder mute',
                }
                interaction.reply(msg);
                break;
            case 'unmute':
                msg = {
                    content: 'placeholder unmute',
                }
                interaction.reply(msg);
                break;
            case "unban":
                msg = {
                    content: 'placeholder unban',
                }
                interaction.reply(msg);
                break;
        }

    }
}).toJSON();
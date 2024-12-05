const discord = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");
const ApplicationCommand = require("../../structure/ApplicationCommand");

module.exports = new ApplicationCommand({
    command: {
        name: 'request-change',
        description: 'lets you make a vote',
        type: 1,
        options: []
    },
    options: {
        cooldown: 5000
    },
    /**
     * 
     * @param {DiscordBot} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    run: async (client, interaction) => {
        await interaction.reply({
            content: 'What kind of action do you want to request?',
            components: [
                new discord.ActionRowBuilder()
			        .addComponents(new discord.StringSelectMenuBuilder()
                        .setCustomId('vote-type')
                        .setPlaceholder('Select an option')
                        .addOptions([
                            new discord.StringSelectMenuOptionBuilder()
                            .setLabel('Promotion')
                            .setValue('promo'),
                            new discord.StringSelectMenuOptionBuilder()
                            .setLabel('Demotion')
                            .setValue('demo'),
                            new discord.StringSelectMenuOptionBuilder()
                            .setLabel('Kick')
                            .setValue('kick'),
                            new discord.StringSelectMenuOptionBuilder()
                            .setLabel('Ban')
                            .setValue('ban'),
                            new discord.StringSelectMenuOptionBuilder()
                            .setLabel('Mute')
                            .setValue('mute'),
                            new discord.StringSelectMenuOptionBuilder()
                            .setLabel('Unmute')
                            .setValue('unmute'),
                            new discord.StringSelectMenuOptionBuilder()
                            .setLabel('Unban')
                            .setValue('unban'),
                ]))
            ]
        });
    }
}).toJSON();
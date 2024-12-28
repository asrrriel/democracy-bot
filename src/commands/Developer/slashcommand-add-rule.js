const Rules = require("../../utils/Rules");
const { ChatInputCommandInteraction, ApplicationCommandOptionType, AttachmentBuilder } = require("discord.js");
const ApplicationCommand = require("../../structure/ApplicationCommand");

module.exports = new ApplicationCommand({
    command: {
        name: 'add-rule',
        description: 'Adds a rule',
        options: [
            {
                name: 'title',
                description: 'The title of the rule.',
                type: ApplicationCommandOptionType.String,
                required: true
            },
            {
                name: 'content',
                description: 'The content of the rule.',
                type: ApplicationCommandOptionType.String,
                required: true
            }
        ]
    },
    options: {
        botDevelopers: true
    },
    /**
     * 
     * @param {typeof(global.client)} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    run: async (client, interaction) => {
        try {
            const title = interaction.options.getString('title', true);
            const content = interaction.options.getString('content', true);

            await Rules.add_rule(title, content);

            await interaction.reply({ content: `Added new rule: ${title}`, ephemeral: true });
        } catch (err) {
            console.error("Failed to generate or send rules embed:", err);
            await interaction.reply({ content: "An error occurred while adding a rule", ephemeral: true });
        }
    }
}).toJSON();

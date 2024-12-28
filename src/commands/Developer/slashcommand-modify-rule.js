const Rules = require("../../utils/Rules");
const { ChatInputCommandInteraction, ApplicationCommandOptionType, AttachmentBuilder } = require("discord.js");
const ApplicationCommand = require("../../structure/ApplicationCommand");

module.exports = new ApplicationCommand({
    command: {
        name: 'modify-rule',
        description: 'Modifies a rule.',
        options: [
            {
                name: 'id',
                description: 'The index of the rule to modify',
                type: ApplicationCommandOptionType.Number,
                required: true
            },
            {
                name: 'new-title',
                description: 'The new title for the rule.',
                type: ApplicationCommandOptionType.String,
                required: true
            },
            {
                name: 'new-content',
                description: 'The new content for the rule.',
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
            const id = interaction.options.getNumber('id', true);
            const new_title = interaction.options.getString('new-title', true);
            const new_content = interaction.options.getString('new-content', true);

            await Rules.mod_rule(id, new_title, new_content);

            await interaction.reply({ content: `Modified rule: ${new_title}`, ephemeral: true });
        } catch (err) {
            console.error("Failed to generate or send rules embed:", err);
            await interaction.reply({ content: "An error occurred while modifieng a rule", ephemeral: true });
        }
    }
}).toJSON();

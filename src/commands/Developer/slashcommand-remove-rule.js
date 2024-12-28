const Rules = require("../../utils/Rules");
const { ChatInputCommandInteraction, ApplicationCommandOptionType, AttachmentBuilder } = require("discord.js");
const ApplicationCommand = require("../../structure/ApplicationCommand");

module.exports = new ApplicationCommand({
    command: {
        name: 'remove-rule',
        description: 'Removes a rule',
        options: [
            {
                name: 'title',
                description: 'The title of the rule to remove.',
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

            Rules.remove_rule(title);
            await interaction.reply({ content: "Removed the rule", ephemeral: true }); // Send the embed
        } catch (err) {
            console.error("Failed to generate or send rules embed:", err);
            await interaction.reply({ content: "An error occurred while removing a rule}.", ephemeral: true });
        }
    }
}).toJSON();

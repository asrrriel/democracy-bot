const Rules = require("../../utils/Rules");
const { ChatInputCommandInteraction, ApplicationCommandOptionType, AttachmentBuilder } = require("discord.js");
const ApplicationCommand = require("../../structure/ApplicationCommand");

module.exports = new ApplicationCommand({
    command: {
        name: 'remove-rule',
        description: 'Removes a rule',
        options: [
            {
                name: 'id',
                description: 'The index of the rule to remove.',
                type: ApplicationCommandOptionType.Number,
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

            Rules.remove_rule(id);
            await interaction.reply({ content: "Removed the rule", ephemeral: true }); // Send the embed
        } catch (err) {
            console.error("Failed to generate or send rules embed:", err);
            await interaction.reply({ content: "An error occurred while removing a rule}.", ephemeral: true });
        }
    }
}).toJSON();

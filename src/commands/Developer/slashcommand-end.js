const { ChatInputCommandInteraction, ApplicationCommandOptionType, AttachmentBuilder } = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");
const ApplicationCommand = require("../../structure/ApplicationCommand");

module.exports = new ApplicationCommand({
    command: {
        name: 'end',
        description: 'End a poll.',
        type: 1,
        options: [{
            name: 'id',
            description: 'MSG id.',
            type: ApplicationCommandOptionType.String,
            required: true
        }]
    },
    options: {
        botOwner: true
    },
    /**
     * 
     * @param {DiscordBot} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    run: async (client, interaction) => {
        const msg_id = interaction.options.getString('id', true);
        const msg = await interaction.channel.messages.fetch(msg_id);

        msg.poll.end();

        await interaction.reply({
            content: 'Poll has been ended.'
        });
    }
}).toJSON();
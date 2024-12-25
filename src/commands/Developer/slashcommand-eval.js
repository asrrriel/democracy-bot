const { ChatInputCommandInteraction, ApplicationCommandOptionType, AttachmentBuilder } = require("discord.js");
const ApplicationCommand = require("../../structure/ApplicationCommand");

module.exports = new ApplicationCommand({
    command: {
        name: 'eval',
        description: 'Execute a JavaScript code.',
        options: [{
            name: 'code',
            description: 'The code to execute.',
            type: ApplicationCommandOptionType.String,
            required: true
        }]
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
        await interaction.deferReply();

        const code = interaction.options.getString('code', true);

        try {
            let result = eval(code);

            if (typeof result !== 'string') result = require('util').inspect(result);

            result = `${result}`.replace(new RegExp(client.token, 'gi'), 'CLIENT_TOKEN'); // To avoid showing the client token to the public

            await interaction.editReply({
                content: 'OK, no errors.',
                files: [
                    new AttachmentBuilder(Buffer.from(`${result}`, 'utf-8'), { name: 'output.ts' })
                ]
            });
        } catch (err) {
            await interaction.editReply({
                content: 'Something went wrong.',
                files: [
                    new AttachmentBuilder(Buffer.from(`${err}`, 'utf-8'), { name: 'output.ts' })
                ]
            });
        };
    }
}).toJSON();
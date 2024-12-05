const { ChatInputCommandInteraction, ApplicationCommandOptionType } = require("discord.js");
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
        await interaction.showModal(
            {
                custom_id: 'vote-modal',
                title: 'Make a vote!',
                components: [{
                    type: 1,
                    components: [{
                        type: 4,
                        custom_id: 'name',
                        label: 'Name the asdfasdf',
                        max_length: 15,
                        min_length: 2,
                        placeholder: 'swa swa swa',
                        style: 2,
                        required: true
                    }]
                }]
            }
        )
    }
}).toJSON();
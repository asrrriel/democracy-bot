const { ChatInputCommandInteraction, AttachmentBuilder } = require("discord.js");
const ApplicationCommand = require("../../structure/ApplicationCommand");
const config = require("../../config");

module.exports = new ApplicationCommand({
    command: {
        name: 'shutdown',
        description: 'Kill the bot.',
        options: []
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
        process.abort();
    }
}).toJSON();
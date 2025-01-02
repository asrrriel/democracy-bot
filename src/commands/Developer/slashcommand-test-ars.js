const { ChatInputCommandInteraction, ApplicationCommandOptionType, AttachmentBuilder } = require("discord.js");
const ApplicationCommand = require("../../structure/ApplicationCommand");

const ARS = require("../../utils/ARS");
module.exports = new ApplicationCommand({
    command: {
        name: 'ars-test',
        description: 'Tests ARS'
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
        const test = ARS.check_req(interaction.member, {acc_age: 9234959058300});
        if(test) {
            await interaction.reply({ content: "You pass", ephemeral: true });
        } else {
            await interaction.reply({ content: "You don't pass", ephemeral: true });
        }
    }
}).toJSON();

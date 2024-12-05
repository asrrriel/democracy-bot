const { ModalSubmitInteraction, Poll, Collection } = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");
const Component = require("../../structure/Component");
const config = require("../../config");

module.exports = new Component({
    customId: 'vote-modal',
    type: 'modal',
    /**
     * 
     * @param {DiscordBot} client 
     * @param {ModalSubmitInteraction} interaction 
     */
    run: async (client, interaction) => {

        const name = interaction.fields.getTextInputValue('name');

        const forum = await client.channels.fetch(config.channels.votes);

        const thread = await forum.threads.create({
            name: name,
            autoArchiveDuration: 60, // its in minutes
            message: {
                content: name,
            },
            reason: 'Vote creation',
        });

        thread.send({
            content: `Discord doesn't let me put the fucking poll in the thread starter message`,
            poll: {
                question: { text: 'placeholder' },
                answers: [
                  { text: 'Yes', emoji: '' },
                  { text: 'No', emoji: '' },
                ],
                allowMultiselect: false,
                duration: 2,
                layoutType: 1, // there are no layouts other than 1
            },
        });

        await interaction.reply({
            content: 'Hello **' + name + '**.',
            ephemeral: true
        });

    }
}).toJSON();
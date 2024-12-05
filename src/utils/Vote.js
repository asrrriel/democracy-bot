const config = require("../../config");

module.exports = {
    async create_vote(client, name) {
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
    }

}
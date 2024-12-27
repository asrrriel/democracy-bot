const { ChatInputCommandInteraction } = require("discord.js");
const ApplicationCommand = require("../../structure/ApplicationCommand");
const SqliteShit = require("../../handler/SqliteShit");
const config = require("../../config");

module.exports = new ApplicationCommand({
    command: {
        name: 'set-rep',
        description: 'Sets the reputation for a user.',
        options: [
            {
                name: 'user',
                description: 'The user to set the reputation for.',
                type: 6,
                required: true
            },
            {
                name: 'amount',
                description: 'The reputation amount to set.',
                type: 4,
                required: true
            }
        ]
    },
    options: {
        cooldown: 1000,
        botDevelopers: true
    },
    run: async (client, interaction) => {
        let user_id = interaction.options.getUser('user').id;
        let amount = interaction.options.getInteger('amount');

        await SqliteShit.work({ cmd: 'set_rep', user_id: user_id, amount: amount });

        interaction.reply({
            content: `Set reputation for ${interaction.guild.members.cache.get(user_id).displayName} to ${amount}.`
        });
    }
}).toJSON();

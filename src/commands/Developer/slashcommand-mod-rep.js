const { ChatInputCommandInteraction } = require("discord.js");
const ApplicationCommand = require("../../structure/ApplicationCommand");
const SqliteShit = require("../../handler/SqliteShit");
const config = require("../../config");

module.exports = new ApplicationCommand({
    command: {
        name: 'modify-rep',
        description: 'Modifies the reputation for a user.',
        options: [
            {
                name: 'user',
                description: 'The user to modify the reputation for.',
                type: 6,
                required: true
            },
            {
                name: 'operation',
                description: 'The operation to perform (set, add, sub, mul, div).',
                type: 3,
                required: true,
                choices: [
                    { name: 'Set', value: 'set' },
                    { name: 'Add', value: 'add' },
                    { name: 'Subtract', value: 'sub' },
                    { name: 'Multiply', value: 'mul' },
                    { name: 'Divide', value: 'div' }
                ]
            },
            {
                name: 'amount',
                description: 'The reputation amount for the operation.',
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
        const user_id = interaction.options.getUser('user').id;
        const operation = interaction.options.getString('operation');
        const amount = interaction.options.getInteger('amount');

        const currentRep = await SqliteShit.work({ cmd: 'get_rep', user_id: user_id });
        let newRep;

        if (currentRep == null || currentRep.rep_count == undefined) {
            interaction.reply({
                content: `Failed to fetch reputation for the specified user.`,
                ephemeral: true
            });
            return;
        }

        switch (operation) {
            case 'set':
                newRep = amount;
                break;
            case 'add':
                newRep = currentRep.rep_count + amount;
                break;
            case 'sub':
                newRep = currentRep.rep_count - amount;
                break;
            case 'mul':
                newRep = currentRep.rep_count * amount;
                break;
            case 'div':
                if (amount === 0) {
                    interaction.reply({
                        content: `Division by zero is not allowed.`,
                        ephemeral: true
                    });
                    return;
                }
                newRep = Math.floor(currentRep.rep_count / amount); // Ensure integer result
                break;
            default:
                interaction.reply({
                    content: `Invalid operation.`,
                    ephemeral: true
                });
                return;
        }

        await SqliteShit.work({ cmd: 'set_rep', user_id: user_id, amount: newRep });

        interaction.reply({
            content: "Modified reputation for `${interaction.guild.members.cache.get(user_id).displayName}`. New reputation: ${newRep}."
        });
    }
}).toJSON();

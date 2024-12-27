const { ChatInputCommandInteraction } = require("discord.js");
const ApplicationCommand = require("../../structure/ApplicationCommand");
const SqliteShit = require("../../handler/SqliteShit");
const config = require("../../config");

module.exports = new ApplicationCommand({
    command: {
        name: 'get-rep',
        description: 'Gets the reputation of any user.',
        options: [
            {
                name: 'user',
                description: 'The user to get the reputation of.',
                type: 6,
                required: false
            }
        ]
    },
    options: {
        cooldown: 1000,
        botDevelopers: !config.modules.reputations.rep_public
    },
    run: async (client, interaction) => {
        if (!config.modules.reputations.enable) {
            interaction.reply({
                content: 'Reputation system is disabled',
                ephemeral: true
            });
            return;
        }

        let user_id = interaction.options.getUser('user') ? interaction.options.getUser('user').id : interaction.user.id;

        let reply = await SqliteShit.work({ cmd: 'get_rep', user_id: user_id });
        console.log(reply);

        if (interaction.options.getUser('user')) {
            cmsg = "";
            if (reply.rep_count == undefined) {
                cmsg = "Couldnt fetch `" + interaction.guild.members.cache.get(user_id).displayName + "`'s rep count";
            } else {
                cmsg = interaction.guild.members.cache.get(user_id).displayName + " has " + reply.rep_count + " REP points";
            }

            interaction.reply({
                content: cmsg
            });
        } else {
            cmsg = "";
            if (reply.rep_count == undefined) {
                cmsg = "Couldnt fetch your rep count";
            } else {
                cmsg = "You have " + reply.rep_count + " REP points";
            }
            interaction.reply({
                content: cmsg
            });
        }
    }
}).toJSON();

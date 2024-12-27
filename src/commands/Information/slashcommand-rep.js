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
    /**
     * 
     * @param {typeof(global.client)} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    run: async (client, interaction) => {
        if(!config.modules.reputations.enable){
            interaction.reply({
                content: 'Reputation system is disabled',
                ephemeral: true
            });
            return;
        }

        let user_id = interaction.options.getUser('user') ? interaction.options.getUser('user').id : interaction.user.id;

        let reply = await SqliteShit.work( {cmd: 'get_rep', user_id: user_id});
        console.log(reply);

        if(interaction.options.getUser('user')) {
            interaction.reply({
                content: interaction.guild.members.cache.get(user_id).displayName + " has " + reply.rep_count + " REP points"
            });
        } else {
            interaction.reply({
                content: "You have " + reply.rep_count + " REP points"
            });
        }
    }
}).toJSON();
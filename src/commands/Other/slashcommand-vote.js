const discord = require("discord.js");
const ApplicationCommand = require("../../structure/ApplicationCommand");
const config = require("../../config");

module.exports = new ApplicationCommand({
    command: {
        name: 'suggest-change',
        description: 'Lets you suggest a change',
        options: []
    },
    options: {
        cooldown: 5000
    },
    /**
     * 
     * @param {typeof(global.client)} client 
     * @param {import("discord.js").ChatInputCommandInteraction} interaction 
     */
    run: async (client, interaction) => {
        if (interaction.channel.type === discord.ChannelType.DM || interaction.guildId !== config.guildId) {
            interaction.reply({
                content: 'This command can only be used in **' + config.guildName + '**',
                ephemeral: true
            })
            return;
        }
        if(config.modules.voting.enable === false) {
            interaction.reply({
                content: 'Voting is disabled',
                ephemeral: true
            })
            return;
        }


        let message = {
            content: 'What kind of action do you want to request?',
            components: [
                new discord.ActionRowBuilder()
			        .addComponents(new discord.StringSelectMenuBuilder()
                        .setCustomId('vote-type')
                        .setPlaceholder('Select an option')
                    )
            ],
            ephemeral: true 
        };

        // Role manager options
        if(config.modules.role_manager.enable) {
            message.components[0].components[0].addOptions(new discord.StringSelectMenuOptionBuilder()
                .setLabel('Promote')
                .setValue('promo')
            )

            message.components[0].components[0].addOptions(new discord.StringSelectMenuOptionBuilder()
                .setLabel('Demote')
                .setValue('demo')
            )
        }

        // Moderation options
        if(config.modules.moderation.enabled && interaction.member.roles.cache.has(config.modules.moderation.mod_role)) {
            if(config.modules.moderation.actions.voted_mute) {
                message.components[0].components[0].addOptions(new discord.StringSelectMenuOptionBuilder()
                    .setLabel('Mute')
                    .setValue('mute')
                );
            }
            if(config.modules.moderation.actions.voted_kick) {
                message.components[0].components[0].addOptions(new discord.StringSelectMenuOptionBuilder()
                    .setLabel('Kick')
                    .setValue('kick')
                );
            }
            if(config.modules.moderation.actions.voted_ban) {
                message.components[0].components[0].addOptions(new discord.StringSelectMenuOptionBuilder()
                    .setLabel('Ban')
                    .setValue('ban')
                );
            }
        }
        interaction.reply(message);

    }
}).toJSON();
const { EmbedBuilder } = require("discord.js");
const SqliteShit = require("../handler/SqliteShit.js");
const { error, info, success, warn } = require("./Console.js");

info('Loading rules...');

module.exports = {
    async add_rule(title, description) {
        try {
            await SqliteShit.work({ cmd: 'add_rule', title, description });
            success(`Added new rule: ${title}`);
        } catch (err) {
            error(`Failed to add rule: ${title}`, err);
        }
    },

    async mod_rule(title, new_title, new_description) {
        try {
            await SqliteShit.work({ cmd: 'mod_rule', new_description, new_title, title });
            success(`Modified rule with title: ${title}`);
        } catch (err) {
            error(`Failed to modify rule: ${title}`, err);
        }
    },

    async remove_rule(title) {
        try {
            await SqliteShit.work({ cmd: 'remove_rule', title });
            success(`Removed rule with title: ${title}`);
        } catch (err) {
            error(`Failed to remove rule: ${title}`, err);
        }
    },

    async create_embeds() {
        try {
            const rules = await SqliteShit.work({ cmd: 'get_all_rules' }); // Fetch all rules
            if (!rules || rules.length === 0) {
                warn("No rules found to create embeds.");
                return new EmbedBuilder()
                    .setTitle("Rules")
                    .setDescription("No rules are currently set.")
                    .setColor(0xff0000);
            }

            const embed = new EmbedBuilder()
                .setTitle("Server Rules")
                .setColor(0x00ff00);

            rules.forEach((rule, index) => {
                embed.addFields({
                    name: `${rule.title}`,
                    value: rule.description || "No description provided.",
                });
            });

            success("Created embed for rules.");
            return embed;
        } catch (err) {
            error("Failed to create embeds for rules.", err);
            throw new Error("Error creating embeds.");
        }
    }
};

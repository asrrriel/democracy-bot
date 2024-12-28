const { EmbedBuilder } = require("discord.js");
const SqliteShit = require("../handler/SqliteShit.js");
const { error, info, success, warn } = require("./Console.js");

info('Loading rules...');

module.exports = {
    async add_rule(title, description) {
        try {
            const ret = await SqliteShit.work({ cmd: 'add_rule', title: title,description: description });
            info(ret.msg);
        } catch (err) {
            error(`Failed to add rule: ${title}`, err);
        }
    },

    async mod_rule(index, new_title, new_description) {
        try {
            const ret = await SqliteShit.work({ cmd: 'mod_rule', description: new_description, title: new_title, rule_id: index });
            info(ret.msg);
        } catch (err) {
            error(`Failed to modify rule: ${index}`, err);
        }
    },

    async remove_rule(index) {
        try {
            const ret = await SqliteShit.work({ cmd: 'remove_rule', rule_id: index });
            info(ret.msg);
        } catch (err) {
            error(`Failed to remove rule: ${index}`, err);
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

            let embeds = [];

            rules.forEach((rule, index) => {
                const embed = new EmbedBuilder()
                    .setTitle(rule.title)
                    .setColor(0x00ff00);

                embed.setDescription(rule.description);

                embeds.push(embed);
            });

            success("Created embed for rules.");
            return embeds;
        } catch (err) {
            error("Failed to create embeds for rules.", err);
            throw new Error("Error creating embeds.");
        }
    }
};

const { EmbedBuilder } = require("discord.js")
const cofig = require("../config");
const SqliteShit = require("../handler/SqliteShit");
const { info, error, success, warn } = require('../utils/Console');

class Rules {

    async add_rule(title, description) {
        await SqliteShit.work({cmd: 'add_rule', title, description})
        success(`Added new rule: ${title}`)
    }

    async mod_rule(title, new_desc, new_title) {
        if (!rule) return error(`Rule ${title} not found`)
        rule.title = new_title
        rule.description = new_desc
        await SqliteShit.work({cmd: 'mod_rule', title, new_title, new_desc})
        success(`Modified rule ${title} to ${new_title}`)
    }

    async remove_rule(title) {
        await SqliteShit.work({cmd: 'remove_rule', title})
        success(`Removed rule ${title}`)
    }

    constructor() {
        info('Loading rules...')
    }

    create_embeds() {
        let embed = new EmbedBuilder()
        .setTitle('Rules')
        .setDescription(this.rules.map(r => `**${r.title}**\n${r.description}`).join('\n\n'))
        .setColor(config.embeds.color)
        .setFooter(config.embeds.footer)
        return embed
    }
}

module.exports = Rules;
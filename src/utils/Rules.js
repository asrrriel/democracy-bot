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

    async send_embeds(channelID) {
        try {
            const rules = await SqliteShit.work({ cmd: 'get_all_rules' }); // Fetch all rules
            if (!rules || rules.length === 0) {
                warn("No rules found to create embeds.");
                return new EmbedBuilder()
                    .setTitle("Rules")
                    .setDescription("No rules are currently set.")
                    .setColor(0xff0000);
            }
    
            // Function to generate a color spectrum from red to red
            function generateColorSpectrum(size) {
                const colors = [];
                const step = 360 / size; // Divide the spectrum evenly
    
                for (let i = 0; i < size; i++) {
                    const hue = (i * step) % 360; // Wrap around to avoid repeating red at the end
                    const hsv = { h: hue, s: 1, v: 1 }; // Full saturation and value
    
                    // HSV to RGB conversion
                    const c = hsv.v * hsv.s;
                    const x = c * (1 - Math.abs(((hsv.h / 60) % 2) - 1));
                    const m = hsv.v - c;
    
                    let r, g, b;
    
                    if (hsv.h >= 0 && hsv.h < 60) {
                        r = c; g = x; b = 0;
                    } else if (hsv.h >= 60 && hsv.h < 120) {
                        r = x; g = c; b = 0;
                    } else if (hsv.h >= 120 && hsv.h < 180) {
                        r = 0; g = c; b = x;
                    } else if (hsv.h >= 180 && hsv.h < 240) {
                        r = 0; g = x; b = c;
                    } else if (hsv.h >= 240 && hsv.h < 300) {
                        r = x; g = 0; b = c;
                    } else {
                        r = c; g = 0; b = x;
                    }
    
                    // Convert RGB to hex
                    const hex = `#${(1 << 24 | (r + m) * 255 << 16 | (g + m) * 255 << 8 | (b + m) * 255).toString(16).slice(1).toUpperCase()}`;
                    colors.push(hex);
                }
                return colors;
            }
    
            const colorSpectrum = generateColorSpectrum(rules.length);
            const embeds = [];
    
            rules.forEach((rule, index) => {
                const embed = new EmbedBuilder()
                    .setTitle(rule.title)
                    .setColor(colorSpectrum[index]) // Use color from spectrum based on index
                    .setDescription(rule.description);
    
                embeds.push(embed);
            });
    
            success("Created embed for rules.");
    
            // Split embeds into batches of 10 and send them
            const batchSize = 10;
            for (let i = 0; i < embeds.length; i += batchSize) {
                const embedBatch = embeds.slice(i, i + batchSize);
                const channel = await client.channels.fetch(channelID); // Fetch the channel by ID
                await channel.send({ embeds: embedBatch }); // Send the batch of embeds
            }
    
        } catch (err) {
            error("Failed to create embeds for rules.", err);
            throw new Error("Error creating embeds.");
        }
    }
    
};

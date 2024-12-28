//ffs
import { createRequire } from "module";
const require = createRequire(import.meta.url);

const fs = require('fs');
fs.writeFileSync('./terminal.log', '', 'utf-8');
const { Database } = require('sqlite-async');


const { Client, Collection, Partials } = require("discord.js");
const CommandsHandler = require("./handler/CommandsHandler");
const { warn, error, info, success } = require("./utils/Console");
const config = require("./config");
const CommandsListener = require("./handler/CommandsListener");
const ComponentsHandler = require("./handler/ComponentsHandler");
const ComponentsListener = require("./handler/ComponentsListener");
const EventsHandler = require("./handler/EventsHandler");
const SqliteShit = require("./handler/SqliteShit");
const Vote = require("./utils/Vote");
const Rules = require("./utils/Rules");



class DemocracyBot extends Client {
    collection = {
        application_commands: new Collection(),
        components: {
            buttons: new Collection(),
            selects: new Collection(),
            modals: new Collection(),
            autocomplete: new Collection()
        }
    }
    rest_application_commands_array = [];
    login_attempts = 0;
    login_timestamp = 0;

    commands_handler = null
    components_handler = null;
    events_handler = null;

    

    db = null;

    constructor() {
        super({
            intents: 3276799,
            partials: [
                Partials.Channel,
                Partials.GuildMember,
                Partials.Message,
                Partials.Reaction,
                Partials.User
            ],
            presence: {
                activities: [{
                    name: 'keep this empty',
                    type: 4,
                    state: 'Starting up...'
                }]
            }
        });
        global.client = this;
        this.commands_handler = new CommandsHandler();
        this.components_handler = new ComponentsHandler();
        this.events_handler = new EventsHandler();
        new CommandsListener();
        new ComponentsListener();

    }

    /**
     * 
     * @param {import("discord.js").Message} oldMessage 
     * @param {import("discord.js").Message} newMessage 
     */
    onMessageUpdate = async function(oldMessage, newMessage){
        await Vote.handleVote(newMessage.id);
    }

    startStatusRotation = () => {
        let index = 0;

        //first rotation
        this.user.setPresence({ activities: [config.statusMessages[index]] });
        index = (index + 1) % config.statusMessages.length;

        setInterval(() => {
            this.user.setPresence({ activities: [config.statusMessages[index]] });
            index = (index + 1) % config.statusMessages.length;
        }, 20000);
    }


    connect = async () => {
        warn(`Attempting to connect to the Discord bot... (${this.login_attempts + 1})`);

        this.login_timestamp = Date.now();

        try {
            await this.login(config.token);
            this.commands_handler.load();
            this.components_handler.load();
            this.events_handler.load();
            this.startStatusRotation();
            this.on('messageUpdate', this.onMessageUpdate);

            warn('Attempting to register application commands... (this might take a while!)');
            await this.commands_handler.registerApplicationCommands();
            success('Successfully registered application commands.');
        } catch (err) {
            error('Failed to connect to the Discord bot, retrying...');
            error(err);
            this.login_attempts++;
            setTimeout(this.connect, 5000);
        }

        //refresh users on startup
        for(const member of this.guilds.cache.get(config.guildId).members.cache.values()) {
            if(!member.user.bot) {
                info(`Refreshing user with ID ${member.id}`);
                await SqliteShit.work({cmd: 'add_user_if_not_exists', user_id: member.id});
            }
        }
    }
}
const client = new DemocracyBot();
const database = await Database.open('./database.db');

client.db = database;
SqliteShit.setupDB(database);

process.on('uncaughtException', console.error);
process.on('unhandledRejection', console.error);

client.connect();
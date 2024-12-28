const config = require("../config");

const prepared_statements = {};

let largest_rule_id = 1;

module.exports = {
    setupDB: async function (db) {
        db.exec(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY,
                rep INTEGER,
                pvote_act TEXT,
                pvote_act_role TEXT,
                pvote_act_recipient TEXT,

                UNIQUE(id)
            )
        `); 

        db.exec(`
            CREATE TABLE IF NOT EXISTS votes (
                msg_id TEXT PRIMARY KEY,
                thread_id TEXT,
                user_id TEXT,
                act TEXT,
                recipient_id TEXT,
                role_id TEXT,

                UNIQUE(msg_id)
            )
        `);

        db.exec(`
            CREATE TABLE IF NOT EXISTS rules (
                id INTEGER PRIMARY KEY,
                title TEXT,
                description TEXT,

                UNIQUE(id)
            )
        `);

        this.db = db;

        prepared_statements['add_user'] = await db.prepare('INSERT OR IGNORE INTO users (id, rep) VALUES (?, ?)');
        prepared_statements['get_rep'] = await db.prepare('SELECT rep FROM users WHERE id = ?');
        prepared_statements['set_rep'] = await db.prepare('INSERT INTO users (id, rep) VALUES (?, ?) ON CONFLICT(id) DO UPDATE SET rep = excluded.rep');

        prepared_statements['add_rule'] = await db.prepare('INSERT OR IGNORE INTO rules (id, title, description) VALUES (?, ?, ?)');
        prepared_statements['get_rule'] = await db.prepare('SELECT * FROM rules WHERE id = ?');
        prepared_statements['remove_rule'] = await db.prepare('DELETE FROM rules WHERE id = ?');
        prepared_statements['mod_rule'] = await db.prepare('UPDATE rules SET description = ?, title = ? WHERE id = ?');

        prepared_statements['get_all_rules'] = await db.prepare('SELECT * FROM rules');

        prepared_statements['add_pvote'] = await db.prepare('UPDATE users SET pvote_act = ? WHERE id = ?');
        prepared_statements['get_pvote'] = await db.prepare('SELECT * FROM users WHERE id = ?');
        prepared_statements['add_pvote_role'] = await db.prepare('UPDATE users SET pvote_act_role = ? WHERE id = ?');
        prepared_statements['add_pvote_recipient'] = await db.prepare('UPDATE users SET pvote_act_recipient = ? WHERE id = ?');

        prepared_statements['add_vote'] = await db.prepare('INSERT INTO votes (msg_id, thread_id, user_id, act, recipient_id, role_id) VALUES (?, ?, ?, ?, ?, ?)');
        prepared_statements['get_vote'] = await db.prepare('SELECT * FROM votes WHERE msg_id = ?');
        prepared_statements['remove_vote'] = await db.prepare('DELETE FROM votes WHERE msg_id = ?');
    },
    work: async function (command) {
        let id = command.user_id;
        let title = command.title;
        let description = command.description;
        let msg_id = command.msg_id;
        let thread_id = command.thread_id;
        let act = command.act;
        let recipient_id = command.recipient_id;
        let role_id = command.role_id;
        let rule_id = command.rule_id;
        switch (command.cmd) {
            case 'add_user':
                let rep = config.modules.reputations.starting_reputation;
                try {
                    prepared_statements['add_user'].run(id, rep);
                    return { msg: "Successfully created new user with ID " + id }
                } catch (error) {
                    if (error.errno === 19) {
                        return { msg: "User with ID " + id + " already exists" }
                    }
                    return { err: error, msg: "Failed to create new user with ID " + id }
                }
            case 'get_rep':
                try {
                    let rep = await prepared_statements['get_rep'].get(id);
                    return { rep_count: rep.rep }
                } catch (error) {
                    return { err: error, msg: "Failed to get reputation of user with ID " + id }
                }

            case 'set_rep':
                try {
                    prepared_statements['set_rep'].run(id, command.amount);
                    return { msg: "Successfully set reputation of user with ID " + id + " to " + command.amount }
                } catch (error) {
                    return { err: error, msg: "Failed to set reputation of user with ID " + id + " to " + command.amount }
                }

            case 'add_rule':
                try {
                    prepared_statements['add_rule'].run(largest_rule_id++,title, description);
                    return { msg: "Successfully added rule with title " + title }
                } catch (error) {
                    return { err: error, msg: "Failed to add rule with title " + title }
                }

            case 'get_rule':
                try {
                    let rule = await prepared_statements['get_rule'].get(rule_id);
                    return { title: rule.title, description: rule.description }
                } catch (error) {
                    return { err: error, msg: "Failed to get rule with title " + title }
                }

            case 'remove_rule':
                try {
                    prepared_statements['remove_rule'].run(rule_id);
                    if(rule_id == largest_rule_id) {
                        largest_rule_id--;
                    }
                    return { msg: "Successfully removed rule with title " + title }
                } catch (error) {
                    return { err: error, msg: "Failed to remove rule with id " + id }
                }

            case 'mod_rule':
                try {
                    const result = await prepared_statements['mod_rule'].run(description, title, rule_id);
                    
                    // Check the result to see if rows were affected
                    if (result.changes > 0) {
                      return { msg: `Successfully modified rule with id ${id}` };
                    } else {
                      return { msg: `No rule found with id ${id}`, err: 'No changes made' };
                    }
                } catch (error) {
                    return { err: error.message, msg: `Failed to modify rule with id ${id}` };
                }
                  

            case 'get_all_rules':
                let rules = (await prepared_statements['get_all_rules']).all();
                return rules

            case 'add_pvote':
                prepared_statements['add_pvote'].run(act, id);
                return { msg: "Successfully updated user with ID " + id }
            case 'get_pvote':
                let pvote = await prepared_statements['get_pvote'].get(id);
                return { act: pvote.pvote_act, role_id: pvote.pvote_act_role, recipient_id: pvote.pvote_act_recipient }
            case 'add_pvote_role':
                prepared_statements['add_pvote_role'].run(role_id, id);
                return { msg: "Successfully updated user with ID " + id }
            case 'add_pvote_recipient':
                prepared_statements['add_pvote_recipient'].run(recipient_id, id);
                return { msg: "Successfully updated user with ID " + id }

            case 'add_vote':
                prepared_statements['add_vote'].run(msg_id, thread_id, id, act, recipient_id, role_id);
                return { msg: "Successfully added vote with ID " + msg_id }
            case 'get_vote':
                let vote = await prepared_statements['get_vote'].get(msg_id);
                return { maker_id: vote.user_id, thread_id: vote.thread_id, act: vote.act, recipient_id: vote.recipient_id, role_id: vote.role_id }
            case 'remove_vote':
                prepared_statements['remove_vote'].run(msg_id);
                return { msg: "Successfully removed vote with ID " + msg_id }

            default:
                return { err: "Unknown command", msg: "Unknown command" }
        }
    },
    execute: async function (command) {
        return await this.db.exec(command);
    }
};
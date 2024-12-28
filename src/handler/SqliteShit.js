const config = require("../config");

const prepared_statements = {};

module.exports = {
    setupDB: async function (db) {
        db.exec(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY,
                rep INTEGER,
                pvote_act TEXT,
                pvote_act_role TEXT,
                pvote_act_recipient TEXT

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
                title TEXT PRIMARY KEY,
                description TEXT
            )
        `);

        this.db = db;

        prepared_statements['add_user'] = await db.prepare('INSERT INTO users (id, rep) VALUES (?, ?)');
        prepared_statements['get_rep'] = await db.prepare('SELECT rep FROM users WHERE id = ?');
        prepared_statements['set_rep'] = await db.prepare('INSERT INTO users (id, rep) VALUES (?, ?) ON CONFLICT(id) DO UPDATE SET rep = excluded.rep');

        prepared_statements['add_rule'] = await db.prepare('INSERT INTO rules (title, description) VALUES (?, ?)');
        prepared_statements['get_rule'] = await db.prepare('SELECT * FROM rules WHERE title = ?');
        prepared_statements['remove_rule'] = await db.prepare('DELETE FROM rules WHERE title = ?');
        prepared_statements['mod_rule'] = await db.prepare('UPDATE rules SET description = ?, title = ? WHERE title = ?');
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
        switch (command.cmd) {
            case 'add_user_if_not_exists':
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
<<<<<<< HEAD
                    return {msg: "Successfully set reputation of user with ID " + id + " to " + command.amount}
                } catch (error) {
                    return {err: error, msg: "Failed to set reputation of user with ID " + id + " to " + amount}
=======
                    return { msg: "Successfully set reputation of user with ID " + id + " to " + command.amount }
                } catch (error) {
                    return { err: error, msg: "Failed to set reputation of user with ID " + id + " to " + command.amount }
>>>>>>> 8560ed6ffe1050f1f8e71605aed78465bdc40b45
                }

            case 'add_rule':
                try {
<<<<<<< HEAD
                    prepared_statements['add_rule'].run(command.title, command.description);
                    return {msg: "Successfully added rule with title " + command.title}
                } catch (error) {
                    return {err: error, msg: "Failed to add rule with title " + command.title}
=======
                    prepared_statements['add_rule'].run(title, description);
                    return { msg: "Successfully added rule with title " + title }
                } catch (error) {
                    return { err: error, msg: "Failed to add rule with title " + title }
>>>>>>> 8560ed6ffe1050f1f8e71605aed78465bdc40b45
                }

            case 'get_rule':
                try {
<<<<<<< HEAD
                    let rule = await prepared_statements['get_rule'].get(command.title);
                    return {title: rule.title, description: rule.description}
                } catch (error) {
                    return {err: error, msg: "Failed to get rule with title " + command.title}
=======
                    let rule = await prepared_statements['get_rule'].get(title);
                    return { title: rule.title, description: rule.description }
                } catch (error) {
                    return { err: error, msg: "Failed to get rule with title " + title }
>>>>>>> 8560ed6ffe1050f1f8e71605aed78465bdc40b45
                }

            case 'remove_rule':
                try {
<<<<<<< HEAD
                    prepared_statements['remove_rule'].run(command.title);
                    return {msg: "Successfully removed rule with title " + command.title}
                } catch (error) {
                    return {err: error, msg: "Failed to remove rule with title " + command.title}
=======
                    prepared_statements['remove_rule'].run(title);
                    return { msg: "Successfully removed rule with title " + title }
                } catch (error) {
                    return { err: error, msg: "Failed to remove rule with title " + title }
>>>>>>> 8560ed6ffe1050f1f8e71605aed78465bdc40b45
                }

            case 'mod_rule':
                try {
<<<<<<< HEAD
                    prepared_statements['mod_rule'].run(command.new_title, command.new_desc, command.title);
                    return {msg: "Successfully modified rule with title " + command.title}
                } catch (error) {
                    return {err: error, msg: "Failed to modify rule with title " + command.title}
                }
            
=======
                    prepared_statements['mod_rule'].run(description, new_title, title);
                    return { msg: "Successfully modified rule with title " + title }
                } catch (error) {
                    return { err: error, msg: "Failed to modify rule with title " + title }
                }

            case 'get_all_rules':
                let rules = await prepared_statements['get_all_rules'].all();
                return rules

>>>>>>> 8560ed6ffe1050f1f8e71605aed78465bdc40b45
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
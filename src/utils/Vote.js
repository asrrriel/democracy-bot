const config = require("../config");

let ongoingVotes = [];
let partialVotes = [];

module.exports = {
    /**
     * 
     * @param {import("discord.js").Message} oldMessage 
     * @param {import("discord.js").Message} newMessage 
     */
    async onMessageUpdate(oldMessage, newMessage){
        if (ongoingVotes.length > 0) {
            for (let i = 0; i < ongoingVotes.length; i++) {
                if (ongoingVotes[i].msg_id == oldMessage.id) {
                    const act = ongoingVotes[i].act;
                    const act_args = ongoingVotes[i].act_args;
                    if(!newMessage.poll.resultsFinalized) return;
                    if(newMessage.poll.answers.get(1).voteCount > newMessage.poll.answers.get(2).voteCount) {
                        switch (act) {
                            case 'promo':
                                const user = global.client.users.cache.get(act_args.user_id);
                                user.send("You have been promoted to **" + newMessage.guild.roles.cache.get(act_args.role_id).name + "**!");
                                const guild = global.client.guilds.cache.get(config.guildId);
                                const member = guild.members.cache.get(user.id);
                                member.roles.add(act_args.role_id);
                                break;
                        }
                    } else {
                        const user = global.client.users.cache.get(act_args.user_id);
                        user.send("Sorry, but your proposal in <#" + newMessage.channel.id + "> has been rejected.");
                    }

                    newMessage.channel.setLocked(true);
                    newMessage.channel.setLocked(true);
                    ongoingVotes.splice(i, 1);
                    break;
                }
            }
        }
    },

    async create_partial_vote(client,userId,act) {
        partialVotes.push({
            user_id: userId,
            title: null,
            name: null,
            act: act,
            act_args: []
        });
    },

    async set_partial_vote_act_arg(client,userId,arg_id, arg) {
        for (let i = 0; i < partialVotes.length; i++) {
            if (partialVotes[i].user_id == userId) {
                partialVotes[i].act_args[arg_id] = arg;
                break;
            }
        }
    },
    async set_partial_vote_title(client,userId, title) {
        for (let i = 0; i < partialVotes.length; i++) {
            if (partialVotes[i].user_id == userId) {
                partialVotes[i].title = title;
                break;
            }
        }
    },

    async set_partial_vote_name(client,userId, name) {
        for (let i = 0; i < partialVotes.length; i++) {
            if (partialVotes[i].user_id == userId) {
                partialVotes[i].name = name;
                break;
            }
        }
    },

    async submit_partial_vote(client,userId) {
        const thread = null;
        for (let i = 0; i < partialVotes.length; i++) {
            if (partialVotes[i].user_id == userId) {
                thread = await this.create_vote(
                    client,partialVotes[i].title, partialVotes[i].name,
                    partialVotes[i].act, partialVotes[i].act_args
                );
                partialVotes.splice(i, 1);
                break;
            }
        }
        return thread;
    },

    async create_vote(client,title, name,act, act_args) {
        const forum = await client.channels.fetch(config.channels.votes);

        const thread = await forum.threads.create({
            name: title,
            autoArchiveDuration: 60, // its in minutes
            message: {
                content: name,
                flags: [ 4096 ] // silent
            },
            reason: 'Vote creation',
        });

        const poll = await thread.send({
            content: `Vote here!`,
            poll: {
                question: { text: 'placeholder' },
                answers: [
                  { text: 'Yes', emoji: '' },
                  { text: 'No', emoji: '' },
                ],
                allowMultiselect: false,
                duration: 2, // in hours
                layoutType: 1, // there are no layouts other than 1
            },
        });

        ongoingVotes.push({
            msg_id: poll.id,
            act: act,
            act_args: act_args
        });

        return thread;
    }
}
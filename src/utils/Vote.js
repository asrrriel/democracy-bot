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
                    const ratio = newMessage.poll.answers.get(1).voteCount / newMessage.poll.answers.get(2).voteCount;
                    if(ratio >= 2/3) {
                        const initiator = await global.client.users.cache.get(act_args.user_id);
                        const guild = await global.client.guilds.cache.get(config.guildId);
                        const i_member = await guild.members.cache.get(initiator.id);
                        switch (act) {
                            case 'promo':
                                i_member.roles.add(act_args.role_id);
                                break;
                            case 'demo':
                                const recipient = global.client.users.cache.get(act_args.recipient_id);
                                const r_member = guild.members.cache.get(recipient.id);
                                r_member.roles.remove(act_args.role_id);
                                recipient.send("You have been demoted by majority vote in <#" + newMessage.channel.id + ">");
                                break;
                            }
                        initiator.send("Your proposal in <#" + newMessage.channel.id + "> has been approved at " +  Math.min(1,ratio)*100 + "%.");
                    } else {
                        const user = global.client.users.cache.get(act_args.user_id);
                        if(isNaN(ratio)) {
                            user.send("Sorry, but your proposal in <#" + newMessage.channel.id + "> recieved no votes.");
                        } else {
                            user.send("Sorry, but your proposal in <#" + newMessage.channel.id + "> has been rejected at " + Math.min(1,ratio)*100 + "%(treshold: 66%).");
                        }
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
        for (let i = 0; i < partialVotes.length; i++) {
            if (partialVotes[i].user_id == userId) {
                partialVotes.slice(i, 1);
            }
        }
        partialVotes.push({
            user_id: userId,
            title: null,
            name: null,
            act: act,
            act_args: []
        });
    },

    async get_partial_vote_act(client,userId) {
        for (let i = 0; i < partialVotes.length; i++) {
            if (partialVotes[i].user_id == userId) {
                return partialVotes[i].act;
            }
        }
    },

    async set_partial_vote_act_arg(client,userId,arg_id, arg) {
        for (let i = 0; i < partialVotes.length; i++) {
            if (partialVotes[i].user_id == userId) {
                partialVotes[i].act_args[arg_id] = arg;
                break;
            }
        }
    },

    async get_partial_vote_act_arg(client,userId,arg_id) {
        for (let i = 0; i < partialVotes.length; i++) {
            if (partialVotes[i].user_id == userId) {
                return partialVotes[i].act_args[arg_id];
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
        var thread = null;
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
        const forum = await client.channels.fetch(config.modules.voting.channel);

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
            content: ``,
            poll: {
                question: { text: title + '?' },
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
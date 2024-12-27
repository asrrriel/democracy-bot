const config = require("../config");
const SqliteShit = require("../handler/SqliteShit");

module.exports = {
    async handleVote(messageId) {
        const guild = await global.client.guilds.cache.get(config.guildId);
        const vote = await SqliteShit.work(global.client.db, {cmd: 'get_vote', msg_id: messageId});

        const vote_channel = await global.client.channels.cache.get(config.modules.voting.channel);
        const vote_thread  = await vote_channel.threads.cache.get(vote.thread_id);
        const message      = await vote_thread.messages.fetch(vote.msg_id);

        if(vote.err !== undefined || message.poll === undefined || !message.poll.resultsFinalized) return;

        const act = vote.act;
        const initiator = await global.client.users.cache.get(vote.maker_id);
        const i_member = await guild.members.cache.get(initiator.id);
        const recipient = global.client.users.cache.get(vote.recipient_id);
        const r_member = guild.members.cache.get(vote.recipient_id);

        const ratio = message.poll.answers.get(1).voteCount / message.poll.answers.get(2).voteCount;
        if(ratio >= 2/3) {
            switch (act) {
                case 'promo':
                    i_member.roles.add(vote.role_id);
                    break;
                case 'demo':
                    r_member.roles.remove(vote.role_id);
                    recipient.send("You have been demoted by majority vote in <#" + message.channel.id + ">");
                    break;
                }
            initiator.send("Your proposal in <#" + message.channel.id + "> has been approved at " +  Math.min(1,ratio)*100 + "%.");
        } else {
            if(isNaN(ratio)) {
                initiator.send("Sorry, but your proposal in <#" + message.channel.id + "> recieved no votes.");
            } else {
                initiator.send("Sorry, but your proposal in <#" + message.channel.id + "> has been rejected at " + Math.min(1,ratio)*100 + "%(treshold: 66%).");
            }
        }

        message.channel.setLocked(true);
        SqliteShit.work(global.client.db, {cmd: 'remove_vote', msg_id: messageId});
    },

    async create_vote(title, text,act,user_id, role_id,recipient_id,reason) {
        const forum = await global.client.channels.fetch(config.modules.voting.channel);

        const thread = await forum.threads.create({
            name: title,
            autoArchiveDuration: 60, // its in minutes
            message: {
                content: text,
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

        SqliteShit.work({
            cmd: 'add_vote',
            user_id: user_id,
            msg_id: poll.id,
            thread_id: thread.id,
            act: act,
            role_id: role_id,
            recipient_id: recipient_id,
        });

        return thread;
    }
}
const SqliteShit = require("../handler/SqliteShit");
module.exports = {
    check_req: async function (member, req) {
        let toret = true;
        if(req.role !== undefined) {
            console.log("a");
            if(!member.roles.cache.has(req.role)) {
                toret = false;
            }
        }

        if(req.rep !== undefined) {
            let rep = await SqliteShit.work({cmd: 'get_rep', user_id: member.id});
            console.log(rep);
            if(rep.rep_count < req.rep) {
                toret = false;
            }
        }

        if (req.acc_age !== undefined) {
            console.log( Date.now() - member.user.createdTimestamp);
            if (Date.now() - member.user.createdTimestamp < req.acc_age) {
                toret = false;
            }
        }

        if(req.member_age !== undefined) {
            console.log(Date.now() - member.joinedTimestamp);
            if(Date.now() - member.joinedTimestamp < req.member_age) {
                toret = false;
            }
        }

        return toret;
    }
}
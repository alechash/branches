const Log = require('../models/Log')

async function isAdmin(user) {
    if (loggedIn(user) == true && user.admin == true) {
        return true
    } else {
        return false
    }
}

async function loggedIn(user) {
    if (user) {
        return true
    } else {
        return false
    }
}

async function createLog(owner, ownerGithub, body) {
    const newLog = new Log({
        body: body,
        owner: owner,
        ownersGithubId: ownerGithub,
        creationDate: Date.now()
    })

    newLog.save().then()

    return newLog._id
}

function timeDifference(current, previous) {

    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;

    var elapsed = current - previous;

    if (elapsed < msPerMinute) {
        return Math.round(elapsed / 1000) + ' seconds ago';
    } else if (elapsed < msPerHour) {
        return Math.round(elapsed / msPerMinute) + ' minutes ago';
    } else if (elapsed < msPerDay) {
        return Math.round(elapsed / msPerHour) + ' hours ago';
    } else if (elapsed < msPerMonth) {
        return 'approximately ' + Math.round(elapsed / msPerDay) + ' days ago';
    } else if (elapsed < msPerYear) {
        return 'approximately ' + Math.round(elapsed / msPerMonth) + ' months ago';
    } else {
        return 'approximately ' + Math.round(elapsed / msPerYear) + ' years ago';
    }
}

async function like(id, postid) {
    var username = id

    var posttoedit = await Log.findById(postid.toString())

    var newLikes = posttoedit.likes
    var likeCount = posttoedit.likes.length + 1

    if (newLikes.includes(username)) {
        return;
    } else {
        newLikes.push(username.toString())

        var update = await Log.findOneAndUpdate({
            _id: postid
        }, {
            likes: newLikes
        });

        update;

        return;
    }
}

async function removelike(userid, postid) {
    var username = userid;

    var posttoedit = await Log.findById(postid)

    var newLikes = posttoedit.likes

    if (newLikes.includes(username) == false) {
        return;
    } else {

        newLikes.splice(newLikes.indexOf(userid), 1)

        var update = await Log.findOneAndUpdate({
            _id: postid
        }, {
            likes: newLikes
        });

        update;

        return;
    }
}

module.exports = {
    isAdmin,
    loggedIn,
    createLog,
    timeDifference,
    like,
    removelike
}
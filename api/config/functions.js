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

module.exports = {
    isAdmin,
    loggedIn
}
const mongoose = require('mongoose');

const User = new mongoose.Schema({

    /** strings */
    username: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    bio: {
        type: String,
        unique: false,
        required: true
    },

    /** social accounts */
    github: {
        type: String,
        unique: false,
        required: true
    },
    githubId: {
        type: String,
        unique: true,
        required: true
    },
    twitter: {
        type: String,
        unique: false,
        required: false
    },
    website: {
        type: String,
        unique: false,
        required: false
    },

    /** booleans */
    moderator: {
        type: Boolean,
        unique: false,
        required: true,
        default: false
    },
    banned: {
        type: Boolean,
        unique: false,
        required: true,
        default: false
    },
});

User.index({
    username: 'text',
    displayname: 'text',
    description: 'text'
});

module.exports = mongoose.model('User', User)
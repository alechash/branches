const mongoose = require('mongoose');

const Log = new mongoose.Schema({
    /** person following */
    follower: {
        type: String,
        unique: false,
        required: true
    },

    /** person being followed */
    followed: {
        type: String,
        unique: false,
        required: true
    }
});

Log.index({
    owner: 'text',
    body: 'text'
});

module.exports = mongoose.model('Log', Log)
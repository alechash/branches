const mongoose = require('mongoose');

const Log = new mongoose.Schema({

    /** strings */
    owner: {
        type: String,
        unique: false,
        required: true
    },
    body: {
        type: String,
        unique: false,
        required: true
    },
    reportReason: {
        type: String,
        unique: false,
        required: false
    },

    /** numbers */
    ownersGithubId: {
        type: Number,
        unique: false,
        required: true
    },

    /** arrays */
    likes: {
        type: Array,
        unique: false,
        required: true,
        default: []
    },

    /** booleans */
    media: {
        type: Boolean,
        unique: false,
        required: true,
        default: false
    },
    reported: {
        type: Boolean,
        unique: false,
        required: true,
        default: false
    },

    /** dates */
    creationDate: {
        type: Date,
        unique: false,
        required: true,
        default: Date.now()
    },
});

Log.index({
    owner: 'text',
    body: 'text'
});

module.exports = mongoose.model('Log', Log)
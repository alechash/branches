"Use strict"

const express = require('express');
const router = express.Router()
require('dotenv').config()
const Name = process.env.NAME
const fs = require('fs')
const User = require('../../models/User');
const Log = require('../../models/Log');
const funcs = require('../../config/functions');
const path = require('path');
const url = require('url');
const mongoose = require('mongoose');
const uuidv4 = require('uuid')
const validUrl = require('valid-url');
const passport = require('passport')
require('../../config/passport')(passport);
const fetch = require('node-fetch');


/**
 * Setting some defaults and /* all paths
 */
var about = {}

router.get('/latest/load/morePosts', async function (req, res, next) {
    const skip = req.query.skip * 20
    var logs

    if (req.query.context == 'latest') {
        logs = await Log.find().skip(skip).limit(20).sort({
            creationDate: -1
        })
    } else if (req.query.context == 'trending') {
        logs = await Log.find().skip(skip).limit(20).sort({
            likes: -1
        }).sort({
            creationDate: -1
        })
    } else if (req.query.context == 'user') {
        logs = await Log.find({
            owner: req.query.userid
        }).skip(skip).limit(20).sort({
            likes: -1
        }).sort({
            creationDate: -1
        })
    } else {
        logs = []
    }

    return res.json(logs)
});

router.post('/like/new', async function (req, res, next) {
    if (!req.user) {
        res.json({
            success: false,
            message: 'login'
        })
    } else {
        funcs.like(req.user._id, req.body.postid)

        res.json({
            success: true,
        })
    }
})

router.post('/like/remove', async function (req, res, next) {
    if (!req.user) {
        res.json({
            success: false,
            message: 'login'
        })
    } else {
        funcs.removelike(req.user._id, req.body.postid)

        res.json({
            success: true,
        })
    }
})

module.exports = router;
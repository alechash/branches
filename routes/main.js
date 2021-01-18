"Use strict"

const express = require('express');
const router = express.Router()
require('dotenv').config()
const Name = process.env.NAME
const fs = require('fs')
const User = require('../models/User');
const Log = require('../models/Log');
const funcs = require('../config/functions');
const path = require('path');
const url = require('url');
const mongoose = require('mongoose');
const uuidv4 = require('uuid')
const validUrl = require('valid-url');
const passport = require('passport')
require('../config/passport')(passport);
const fetch = require('node-fetch');
const fiveDaysAgo = new Date(Date.now() - (5 * 24 * 60 * 60 * 1000));
const oid = new mongoose.Types.ObjectId();
const now = new Date();


/**
 * Setting some defaults and /* all paths
 */
var about = {}

router.get('/*', async function (req, res, next) {
    about.name = Name
    about.path = req.path
    about.loggedin = await funcs.loggedIn(req.user)
    about.user = req.user

    next()
});


/** 
 * Main paths, used for all main functions of the site
 * 
 * These are all the main GET requests that will show
 * data like posts, users, settings pages, etc.
 */
// GET, home page
router.get('/', async function (req, res, next) {
    if (await funcs.loggedIn(req.user)) {
        return res.redirect('/home')
    }

    about.data = await fetch('https://api.github.com/repos/mr-winson/branches', {
            headers: {
                'Authorization': 'Basic ' + process.env.GITHUB_OAUTH_TOKEN,
            }
        })
        .then(res => res.json())

    about.logCount = await Log.estimatedDocumentCount()
    about.userCount = await User.estimatedDocumentCount()

    about.title = 'Welcome to Branches - ' + Name
    about.template = 'main/index'
    about.navbar = true
    about.footer = true

    return res.render('base', about);
})

// GET, main page
router.get('/home', async function (req, res, next) {
    if (await funcs.loggedIn(req.user) == false) {
        return res.redirect('/')
    }

    about.title = 'Branches Home - ' + Name
    about.template = 'main/home'
    about.navbar = true
    about.footer = true

    return res.render('base', about);
})

// GET, latest page
router.get('/latest', async function (req, res, next) {
    if (!req.query.p || req.query.p <= 0) {
        req.query.p = 1
    }

    var userid = 'notloggedin'

    if (req.user) {
        userid = req.user._id
    }

    const skip = Number((req.query.p - 1) * 20)

    about.posts = await Log.find().skip(skip).limit(20).sort({
        creationDate: -1
    })
    about.title = 'Branches Home - ' + Name
    about.template = 'main/latest'
    about.navbar = true
    about.footer = true
    about.userid = userid

    return res.render('base', about);
})

// GET, latest page
router.get('/explore', async function (req, res, next) {
    if (!req.query.p || req.query.p <= 0) {
        req.query.p = 1
    }

    var userid = 'notloggedin'

    if (req.user) {
        userid = req.user._id
    }

    const skip = Number((req.query.p - 1) * 20)

    about.posts = await Log.find().limit(20).sort({
        likes: -1
    }).sort({
        creationDate: -1
    })
    about.title = 'Branches Home - ' + Name
    about.template = 'main/explore'
    about.navbar = true
    about.footer = true
    about.userid = userid

    return res.render('base', about);
})

// GET, main page
router.get('/p/:postid', async function (req, res, next) {
    about.title = 'Post - ' + Name
    about.template = 'main/post'
    about.navbar = true
    about.footer = true

    const log = await Log.findById(req.params.postid)
    const owner = await User.findById(log.owner)

    about.log = log
    about.owner = owner
    about.creationDate = funcs.timeDifference(Date.now(), log.creationDate)

    return res.render('base', about);
})

// GET, main page
router.get('/trending', async function (req, res, next) {
    Log.find().limit(5).sort({
        likes: -1
    }).sort({
        creationDate: -1
    }).then(posts => res.json(posts))
})

// GET, main page
router.get('/api/latest', async function (req, res, next) {
    Log.find().limit(5).sort({
        creationDate: -1
    }).then(posts => res.json(posts))
})


/** 
 * Main posts, used for all main functions of the site
 * 
 * These are the main POST paths for all the main fun-
 * -ctions of the site like posting Log's, editing se-
 * -ttings and liking Log's.
 */
// POST, create a new log
router.post('/post', async function (req, res, next) {
    if (!req.user) {
        res.redirect('/login')
    }

    const body = req.body.log
    const owner = req.user.id
    const ownerGithub = req.user.githubId

    const log = await funcs.createLog(owner, ownerGithub, body)

    res.redirect(`/p/${log}`)
})

module.exports = router;
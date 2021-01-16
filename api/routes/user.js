"Use strict"

const express = require('express');
const router = express.Router()
require('dotenv').config()
const Name = process.env.NAME
const fs = require('fs')
const User = require('../models/User');
const funcs = require('../config/functions');
const path = require('path');
const url = require('url');
const mongoose = require('mongoose');
const uuidv4 = require('uuid')
const validUrl = require('valid-url');
const passport = require('passport')
require('../config/passport')(passport);


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
 * Logging in, currently only thtough GitHub
 * 
 * We will... i needto add a comment explai-
 * -ning this
 */
// GET, handling github oauth
router.get('/account/oauth/callback/github', passport.authenticate('github', {
    scope: ['user:email']
}), async function (req, res, next) {
    return res.redirect('/home?loginsuccess=1')
})

router.get('/account/oauth/verify/github', passport.authenticate('github', {
    scope: ['user:email']
}), function (req, res) {});

router.get('/login', async function (req, res, next) {
    return res.redirect('/account/oauth/verify/github')
})

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

module.exports = router;
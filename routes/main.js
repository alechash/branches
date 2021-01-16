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
 * Main paths, used for all main functions of the site
 * 
 * 
 */
// GET, home page
router.get('/', async function (req, res, next) {
    if (await funcs.loggedIn(req.user)) {
        return res.redirect('/home')
    }

    about.title = 'Welcome to Branches - ' + Name
    about.template = 'main/index'
    about.navbar = true
    about.footer = true

    return res.render('base', about);
})

// GET, main page
router.get('/home', async function (req, res, next) {
    about.title = 'Branches Home - ' + Name
    about.template = 'main/home'
    about.navbar = true
    about.footer = true

    return res.render('base', about);
})

module.exports = router;
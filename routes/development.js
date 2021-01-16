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


module.exports = router;
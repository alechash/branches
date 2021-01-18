'Use strict'

const express = require('express');
const app = express();
const passport = require('passport');
const mongoose = require('mongoose');
require('dotenv').config()
const port = process.env.PORT
const session = require('express-session');
require('./config/passport')(passport)

app.use(require('serve-static')('./public'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({
    extended: true
}));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false
    }
}))

app.use(passport.initialize());
app.use(passport.session());

app.set('views', './views');
app.set('view engine', 'ejs');

if (process.env.ENV == "p" || process.env.ENV == "production") {
    const main = require('./routes/main')
    app.use('/', main);
    const internalApi = require('./routes/api/internal')
    app.use('/api', internalApi);
    const user = require('./routes/user')
    app.use('/', user);
} else {
    const development = require('./routes/development')
    app.use('/', development);
}

mongoose.connect(process.env.MONGO, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
});

app.listen(port, function () {
    console.log(process.env.NAME + ' is live at: http://localhost:' + port);
});
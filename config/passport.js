var GitHubStrategy = require('passport-github2').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config()

var profile = {}

module.exports = function (passport) {
    passport.use(new GitHubStrategy({
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: process.env.GITHUB_CLIENT_CALLBACK
        },
        async function (accessToken, refreshToken, profile, done) {
            const exists = await User.exists({
                githubId: profile._json.id,
            })

            if (exists == false) {
                const newUser = new User({
                    username: profile.username,
                    email: profile._json.email,
                    bio: profile._json.bio,
                    github: profile.username,
                    githubId: profile._json.id,
                    website: profile._json.blog
                });

                newUser.save().then(user => {
                    done(null, user);
                })
            } else {
                const updateUser = await User.findOneAndUpdate({
                    githubId: profile._json.id,
                }, {
                    github: profile.username,
                    githubId: profile._json.id,
                }, function (err, user) {});

                updateUser.save().then(user => {
                    done(null, user);
                })
            }
        }));

    passport.serializeUser(function (user, done) {
        done(null, user);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });
};
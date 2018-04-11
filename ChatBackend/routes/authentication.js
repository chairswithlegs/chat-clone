module.exports = (passport) => {
    const express = require('express');
    const jwt = require('jsonwebtoken');
    const User = require('../models/user');
    const router = new express.Router();
    


    //ROUTES

    //Login a user by generating a JWT and returning it to the client
    router.post('/login', passport.authenticate('local', { session: false }), (req, res) => {
        const payload = { username: req.user.username };
        const token = jwt.sign(payload, process.env.JWT_KEY);
        res.json({ token: token });
    });

    //Validate a JWT token with a simple, JWT secured, GET request
    router.get('/validate-token', passport.authenticate('jwt', { session: false }), (req, res) => {
        res.json({ message: 'Token is valid', username: req.body.username });
    });

    //Create a new user account
    router.post('/create-account', (req, res, next) => {
        const username = req.body['username'];
        const password = req.body['password'];

        //Validate the request body
        if (!username || !password) {
            res.status(400).json({ error: 'Request must include username and password.' });
            return;
        }

        //First, make sure the username isn't already taken
        User.findOne({ username: username }, (error, user) => {
            if (error) {
                next(error);
            } else if (user) {
                res.status(400).json({ error: 'Username already exists.' });
            } else {
                //Create the new user account...
                const newUser = new User({
                    username: username,
                    password: password
                });
                //... and save it to the database
                newUser.save((error) => {
                    if (error)
                        next(error);
                    else
                        res.json({ message: 'Account created successfully.' });
                });
            }
        })
    });

    return router;
}


module.exports = (passport) => {
    const express = require('express');
    const jwt = require('jsonwebtoken');
    const User = require('../models/user');
    const router = new express.Router();
    
    router.post('/login', passport.authenticate('local', { session: false }), (req, res) => {
        const payload = { username: req.user.username };
        const token = jwt.sign(payload, process.env.JWT_KEY);
        res.json({ token: token });
    });

    router.get('/validate-token', passport.authenticate('jwt', { session: false }), (req, res) => {
        res.json({ message: 'Token is valid' });
    });

    router.post('/create-account', (req, res) => {
        const username = req.body['username'];
        const password = req.body['password'];

        if (!username || !password) {
            res.status(400).json({ error: 'Invalid username or password.' });
            return;
        }

        User.findOne({ username: username }, (error, user) => {
            if (user) {
                res.status(400).json({ error: 'Username already exists.' });
            }
            else if (error) {
                console.log(`Error creating user: ${error}`);
                res.status(500).json({ error: 'Could not create account.' });
            } else {
                const newUser = new User({
                    username: username,
                    password: password
                });

                newUser.save((error) => {
                    if (error) {
                        console.log(`Error creating user: ${error}`);
                        res.status(500).json({ error: 'Could not create account.' });
                    }
                    else {
                        res.json({ message: 'Account created successfully.' });
                    }  
                });
            }
        })
    });

    return router;
}


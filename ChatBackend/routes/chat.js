module.exports = (server, passport) => {
    const io = require('socket.io')(server);
    const express = require('express');
    const Room = require('../models/room');
    const Message = require('../models/message');
    const router = new express.Router();



    //ROUTES

    //Creates a new room (requires name and (optional) password in req body)
    router.post('/create-room', passport.authenticate('jwt', { session: false }), (req, res, next) => {
        //Verify that the room is given a name
        if (req.body.name === undefined) res.status(400).json({ error: 'Room must be given a name.' });
        
        //Populate the new room with the request values
        const newRoomParams = { name: req.body.name, adminId: req.user._id }
        //Optionally add the password to the new room
        if (req.body.password) newRoomParams.password = req.body.password;
        
        //Create and attempt to save the new room
        const newRoom = new Room(newRoomParams);
        newRoom.save((error, room) => {
            if (error) {
                next(error); //Pass along the error for middleware handling
            } else {
                res.json({
                    message: 'Room successfully created.',
                    room: {
                        name: room.name,
                        roomId: room._id,
                        hasPassword: !!room.password,
                        adminStatus: req.user.id === room.adminId
                    }
                });
            } 
        });
    });

    //Deletes the room (must be the room admin, must have id (of the room) in req body)
    router.post('/delete-room', passport.authenticate('jwt', { session: false }), (req, res, next) => {
        const adminId = req.user._id; //Appended and verified by passport
        
        //Verify the room id was sent
        if (req.body.id === undefined) res.status(400).json({ error: 'No room id specified.' });
        
        //Attempt to find and delete the room
        Room.findOne({ _id: req.body.id, adminId: adminId }, (error) => next(error))
        .remove((error) => {
            if (error)
                next(error);
            else
                res.json({ message: 'Room successfully deleted.' });
        });
    });

    //Returns an array with all the rooms
    router.get('/room-list', passport.authenticate('jwt', { session: false }), (req, res, next) => {
        Room.find((error, rooms) => {
            //Propagate database errors for middleware handling
            if (error) {
                next(error);
                return;
            }
            
            //Create and send a room array with the following info: name, id, and password(boolean)
            const roomList = [];
            for(let i=0; i<rooms.length; i++) {
                const room = { 
                    name: rooms[i].name,
                    roomId: rooms[i]._id,
                    hasPassword: !!rooms[i].password,
                    adminStatus: req.user.id === rooms[i].adminId
                }
                roomList.push(room);
            }
            res.json(roomList);
        });
    });

    router.get('/room-list/:roomId', passport.authenticate('jwt', { session: false }), (req, res, next) => {
        Room.findById(req.params.roomId, (error, room) => {
            if (error) {
                next(error);
            } else if (!room) {
                res.status(400).json({ error: 'Room not found.' });
            } else {
                const response = {
                    name: room.name,
                    roomId: room._id,
                    hasPassword: !!room.password,
                    adminStatus: req.user.id === room.adminId
                }
                res.json(response);
            }
        });
    });
    
    //Adds the client socket to a chat room
    router.post('/join-room', passport.authenticate('jwt', { session: false }), (req, res, next) => {
        const socket = io.sockets.sockets[req.body.socketId];
        const userId = req.user._id;

        //Make sure the request body is complete
        if (socket === undefined || req.body.roomId === undefined) {
            res.status(400).json({ error: 'Could not join room' });
            return;
        }

        //Find the room in the database
        Room.findOne({ _id: req.body.roomId }, (error, room) => {
            if (error) { //Scenario 1: Server or database error
                next(error)
            } else if (room === null) { //Scenario 2: Room doesn't exist
                res.status(400).json({ error: 'Room does not exist'});
            } else if (room.password) { //Scenario 3: Password protected room
                room.comparePassword(req.body.password || '', (error, match) => {
                    if (error) {
                        next(error);
                    } else if (match || userId == room.adminId) { //Correct password OR room admin
                        socket.join(room.id); //Add client socket to room
                        emitStoredMessages(room.id, socket); //Emit stored messages
                        res.json(({ message: `You joined the room.`}));
                    } else { //Password incorrect
                        res.status(401).json({ error: 'Invalid password. Failed to join room.' });
                    }
                });
            } else { //Scenario 4: Room with no password
                socket.join(room.id); //Add client socket to room
                emitStoredMessages(room.id, socket); //Emit stored messages
                res.json(({ message: `You joined the room.`}));
            }
        });
    });

    //Post a chat message to a room
    router.post('/send-message', passport.authenticate('jwt', { session: false }), (req, res, next) => {
        const socket = io.sockets.sockets[req.body.socketId];
        const username = req.user.username; //Appended and verified by passport

        //Make sure request body is complete
        if (!socket || typeof(req.body.roomId) != 'string' || typeof(req.body.messageText) != 'string') {
            res.status(400).json({ error: 'Failed to create message' });
            return;
        }

        //If the client socket is not in the room, don't send the message
        if (socket.rooms[req.body.roomId] === undefined) {
            res.status(400).json({ error: 'Socket not connected to room. Failed to create message' });
            return;
        }

        //Create the new message
        const newMessage = new Message({
            messageText: req.body.messageText,
            roomId: req.body.roomId,
            author: username
        });

        //Save the message to the database
        newMessage.save((error, message) => {
            if (error) {
                next(error)
            } else {
                const _message = {
                    messageText: message.messageText,
                    author: message.author,
                    roomId: message.roomId
                }
                io.to(req.body.roomId).emit('message', _message);
                res.json({ message: 'Message sent', message: _message });
            }
        });
    });



    //CONVENIENCE FUNCTIONS

    //Have a socket emit all the stored message for a specific room
    function emitStoredMessages(roomId, socket, next) {
        Message.find({ roomId: roomId }, (error, messages) => {
            if (!error && messages) {
                messages.forEach((message) => {
                    const _message = {
                        messageText: message.messageText,
                        author: message.author,
                        roomId: message.roomId
                    }

                    socket.emit('message', _message)
                });
            }
        });
    }
    
    return router;
}

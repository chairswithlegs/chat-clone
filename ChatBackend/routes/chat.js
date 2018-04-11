module.exports = (server, passport) => {
    const io = require('socket.io')(server);
    const express = require('express');
    const Room = require('../models/room');
    const Message = require('../models/message');
    const jwt = require('jsonwebtoken');
    const config = require('../config');
    
    //This router will handle room creation and deletion
    const router = new express.Router();

    //Creates a new room (requires name and (optional) password in req body)
    router.post('/create-room', passport.authenticate('jwt', { session: false }), (req, res) => {
        //Populate the new room with the request values
        const newRoomParams = {
            name: req.body.name,
            adminId: req.user._id
        }
        //Optionally add the password to the new room
        if (req.body.password) newRoomParams.password = req.body.password;
        
        //Create and attempt to save the new room
        const newRoom = new Room(newRoomParams);
        newRoom.save((error, room) => {
            if (error) {
                console.log(`Failed to create room: ${error}`);
                res.status(400).json({ error: 'Could not create room.' });
            } else {
                res.json({ 
                    message: 'Room successfully created.',
                    id: room._id
                });
            }
        });
    });


    //Deletes the room (must be the room admin, must have id (of the room) in req body)
    router.post('/delete-room', passport.authenticate('jwt', { session: false }), (req, res) => {
        const roomId = req.body.id;
        const adminId = req.user._id; //Appended to request by passport, verified by JWT
        
        Room.findOne({ _id: roomId, adminId: adminId }).remove((error) => {
            if (error) {
                console.log(`Failed to delete room: ${error}`);
                res.status(400).json({ error: 'Could not delete room.' });
            } else {
                res.json({ message: 'Room successfully deleted.' });
            }
        });
    });

    //Returns an array with all the rooms
    router.get('/room-list', passport.authenticate('jwt', { session: false}), (req, res) => {
        Room.find((error, rooms) => {
            const roomList = [];

            for(let i=0; i<rooms.length; i++) {
                const room = { 
                    name: rooms[i].name,
                    id: rooms[i]._id,
                    password: !!rooms[i].password
                }

                roomList.push(room);
            }

            res.json(roomList);
        });
    });
    
    //Adds the client socket to a chat room
    router.post('/join-room', passport.authenticate('jwt', { session: false }), (req, res) => {
        const socket = io.sockets.sockets[req.body.socketId];
        const roomId = req.roomId;
        const password = req.password || '';

        Room.findOne({ _id: roomId }, (error, room) => {
            if (error) {
                console.log(error);
                res.status(400).json({ error: 'Could not join room.' });
            } else if (room.password) {
                room.comparePassword(password, (error, match) => {
                    if (match) {
                        socket.join(room.id);
                        socket.to(room.id).emit('Joined room');
                        res.json(({ message: `Socket ${socket.id} joined the room.`}));
                    } else {
                        res.status(400).json({ error: 'Invalid password. Failed to join room.' });
                    }
                });
            } else {
                socket.join(room.id);
                socket.to(room.id).emit('Joined room');
                res.json(({ message: `Socket ${socket.id} joined the room.`}));
            }
        });
    });

    //Removes a client socket from a room
    router.post('/leave-room', passport.authenticate('jwt', { session: false }), (req, res) => {
        const socket = io.sockets.sockets[req.body.socketId];
        const roomId = req.body.roomId;

        socket.leave(roomId);
        res.json({ message: 'Successfully left the room' });
    });

    //Post a chat message to a room
    router.post('/create-message', passport.authenticate('jwt', { session: false }), (req, res) => {
        const socket = io.sockets.sockets[req.body.socketId];
        const roomId = req.body.roomId;
        const message = req.body.message;
        const username = req.user.username;

        //If the client socket is not in the room, don't send the message
        if (socket.rooms.indexOf(roomId) === -1) {
            res.json({ error: `Failed to send message in room ${roomId}`});
            return;
        };

        const newMessage = new Message({
            message: message,
            roomId: roomId,
            auther: username
        });

        newMessage.save((error, _message) => {
            if (error) {
                console.log(error);
                res.json({ error: 'Failed to create message' });
            } else {
                io.to(roomId).emit(_message.message);
                res.json({ message: 'Message sent' });
            }
        });
    });

    //For testing purposes TODO: DELETE
    io.on('connect', (socket) => {
        console.log('A user connected');
        socket.on('disconnect', () => console.log('A user disconnected'));
    });
    
    return router;
}
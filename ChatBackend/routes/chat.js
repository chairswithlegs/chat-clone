module.exports = (server, passport) => {
    const io = require('socket.io')(server);
    const express = require('express');
    const router = new express.Router();
    const Room = require('../models/room');
    const Message = require('../models/message');  
    
    //This router will handle room creation and deletion
    router.post('/create-room', passport.authenticate('jwt', { session: false }), (req, res) => {
        const newRoomParams = {
            name: req.name,
            admin: req.user.id
        }
        
        if (req.password) newRoomParams.password = req.password;
        
        const newRoom = new Room(newRoomParams);
        newRoom.save((error, room) => {
            if (error) {
                console.log(error);
                res.status(500).json({ error: 'Could not create room.' });
            } else {
                res.json({ 
                    message: 'Room successfully created.',
                    id: room.id
                });
            }
        });
    });
    
    router.post('/delete-room', passport.authenticate('jwt', { session: false }), (req, res) => {
        const roomId = req.roomId;
        const admin = req.user.id; //Appended to request by passport, verified by JWT
        
        Room.findOne({ id: roomId, admin: admin }).remove((error) => {
            if (error) {
                console.log(error);
                res.status(400).json({ error: 'Could not delete room.' });
            } else {
                res.json({ message: 'Room successfully deteled.' });
            }
        });
    });
    

    //Socket.io handles joining/leaving rooms and sending messages
    io.on('connect', (socket) => {
        console.log('A user connected');
        
        //Add socket to a room and emit stored messages to it
        socket.on('join room', (req) => {
            const password = req.password || '';
            const roomId = req.roomId;
            
            Room.findOne({ id: roomId }, (error, room) => {
                //TODO check the password
                if (error) {
                    console.log(error);
                    res.status(400).json({ error: 'Could not join room.' });
                } else {
                    console.log('User joined room');
                    socket.join(roomId);
                    res.json({ message: 'Successfully joined room.' });
                    
                    //Emit stored messages to the new room member
                    Message.find({ roomId: roomId }, (error, messages) => {
                        if (error) {
                            console.log(error);
                        }
                        else {
                            for(let i=0; i<message.length; i++) {
                                socket.to(roomId).emit(message[i]);
                            }
                        }
                    });
                }
            });
        });
        
        //Remove a socket from a room
        socket.on('leave room', (roomId) => {
            socket.leave(roomId);
            console.log('User left room');
        });
        
        //Emit messages to a room
        socket.on('chat message', (req) => {
            const roomId = req.roomId;
            const message = req.message;
            
            //Verify that the socket has been added to the room list (see 'join room' callback)
            if (socket.rooms.indexOf(roomId) != -1) {
                //Save the message to the database, then emit the message
                io.to(roomId).emit(message);
                console.log('User sent room message');
            }
        });
    });
    
    return router;
}
module.exports = (server, passport) => {
    const io = require('socket.io')(server);
    const express = require('express');
    const Room = require('../models/room');
    const Message = require('../models/message');
    
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
        
        if (roomId === undefined) {
            res.status(400).json({ error: 'Could not delete room.' });
        }

        Room.findOne({ _id: roomId, adminId: adminId }).remove((error) => {
            if (error) {
                console.log(`Could not delete room: ${error}`);
                res.status(500).json({ error: 'Could not delete room.' });
            } else {
                res.json({ message: 'Room successfully deleted.' });
            }
        });
    });

    //Returns an array with all the rooms
    router.get('/room-list', passport.authenticate('jwt', { session: false }), (req, res) => {
        Room.find((error, rooms) => {
            if (error) {
                console.log(`Failed to get room list: ${error}`);
                res.status(500).json({ error: 'Could not delete room.' });
            }
            
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
        const roomId = req.body.roomId;
        const password = req.password || '';

        //Make sure the request body is complete
        if (socket === undefined || roomId === undefined) {
            res.status(400).json({ error: 'Could not join room' });
            return;
        }

        //Find the room in the database
        Room.findOne({ _id: roomId }, (error, room) => {
            if (error) { //Scenario 1: Server or database error
                console.log(error);
                res.status(500).json({ error: 'Error joining room' });
            } else if (room === null) { //Scenario 2: Room doesn't exist
                res.status(400).json({ error: 'Room does not exist'});
            } else if (room.password) { //Scenario 3: Password protected room
                room.comparePassword(password, (error, match) => {
                    if (match) { //Password correct
                        socket.join(room.id); //Add client socket to room so they get a room messages
                        emitStoredMessages(room.id, socket); //Emit stored messages
                        res.json(({ message: `You joined the room.`}));
                    } else { //Password incorrect
                        res.status(400).json({ error: 'Invalid password. Failed to join room.' });
                    }
                });
            } else { //Scenario 4: Room with no password
                socket.join(room.id); //Add client socket to room so they get messages
                emitStoredMessages(room.id, socket); //Emit stored messages
                res.json(({ message: `You joined the room.`}));
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
        const messageText = req.body.messageText;
        const username = req.user.username; //Appended to request by passport, verified by JWT

        //Make sure request body is complete
        if (!socket || !roomId || !messageText) {
            res.status(400).json({ error: 'Failed to create message' });
            return;
        }

        //If the client socket is not in the room, don't send the message
        if (socket.rooms[roomId] === undefined) {
            res.json({ error: 'Failed to create message' });
            return;
        }

        //Create the new message
        const newMessage = new Message({
            messageText: messageText,
            roomId: roomId,
            author: username
        });

        //Save the message to the database
        newMessage.save((error, message) => {
            if (error) {
                console.log(error);
                res.status(500).json({ error: 'Failed to create message' });
            } else {
                io.to(roomId).emit('message', message.messageText);
                res.json({ message: 'Message sent' });
            }
        });
    });

    //Have a socket emit all the stored message for a specific room
    function emitStoredMessages(roomId, socket) {
        Message.find({ roomId: roomId }, (error, messages) => {
            messages.forEach((message) => socket.emit('message', message.messageText));
        });
    }
    
    return router;
}

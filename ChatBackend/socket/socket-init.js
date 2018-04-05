//This file instantiates socket.io and registers its callbacks
module.exports = (server) => {
    const io = require('socket.io')(server);

    //DELETE
    io.on('connect', (socket) => {
        console.log('A user connected');
    });
    //DELETE END

    return io;
}
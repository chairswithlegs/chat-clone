const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    messageText: { type: String, required: true },
    roomId: { type: String, required: true },
    author: { type: String, required: true }
});

module.exports = mongoose.model('Message', messageSchema);
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const roomSchema = new mongoose.Schema({
    name: { type: String, required: true },
    password: { type: String },
    adminId: { type: String, required: true }
});

//Hashes the password before saving to the database
roomSchema.pre('save', function(next) { //Don't use an arrow function, mongoose  will set 'this' to the user object
    if (this.password === undefined) {
        next();
    } else {
        bcrypt.hash(this.password, 6, (error, hash) => {
            if (error) {
                next(error);
            } else {
                this.password = hash;
                next();
            }
        });
    }
});

//Allows us to compare a password to the hashed version
roomSchema.methods.comparePassword = function(password, callback) { //Don't use an arrow function, mongoose  will set 'this' to the user object
    if (this.password === undefined) {
        callbacked ({ message: 'Room is not password protected.'});
    } else {
        bcrypt.compare(password, this.password, (error, match) => {
            if (error) {
                callback(error);
            } else {
                callback(error, match);
            }
        });
    }
}

module.exports = mongoose.model('Room', roomSchema);
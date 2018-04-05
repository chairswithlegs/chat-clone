//LOAD AND CONFIGURE MODULES

//Load the config
const config = require('./config');

//Create the express app
const express = require('express');
const app = express();

//Create the http server with the express app included
const http = require('http');
const server = http.createServer(app);

//Load mongoose and connect
const mongoose = require('mongoose');
mongoose.connection.on('error', () => console.log('Database connection error.'));
mongoose.connection.once('open', () => console.log('Connected to database.'));

//Load and configure socket.io with the server
const io = require('./socket/socket-init')(server);

//Load and configure passport
const passport = require('passport');
const passportStrategies = require('./passport-strategies');
passport.use(passportStrategies.local);
passport.use(passportStrategies.jwt);

//Load misc. middleware
const bodyParser = require('body-parser');
const cors = require('cors');

//Load the routes
const authenticationRouter = require('./routes/authentication')(passport);



//ADD MIDDLEWARE AND ROUTES TO APP

//Add middleware to the request pipeline
app.use(bodyParser.json());
app.use(passport.initialize());

//Allow cross-origin requests if we are doing dev work
if (process.env.ENVIRONMENT === 'Development') {
    app.use(cors());
}

//Add the api routes
app.use('/api/authentication', authenticationRouter);

//Add the public files (Angular app), and redirect all uncaught GET requests to the app as well
app.use(express.static('public'));
app.get('*', (req, res) => res.sendFile(`${__dirname}/public/index.html`));



//CONNECT TO THE DATABASE AND START THE SERVER
mongoose.connect(config.connectionString, (error) => {
    if (error) {
        console.log(error);
    } else {
        server.listen(config.port, () => {
            console.log(`Server listening on ${server.address().port}`)
        });
    }
});

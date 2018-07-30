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

//Load and configure passport
const passport = require('passport');
const passportStrategies = require('./passport-strategies');
passport.use(passportStrategies.local);
passport.use(passportStrategies.jwt);

//Load misc. middleware
const bodyParser = require('body-parser');
const cors = require('cors');
const errorLogger = require('./middleware/errorLogger');
const errorHandler = require('./middleware/errorHandler');

//Load the routes
const authenticationRouter = require('./routes/authentication')(passport);
const chatRouter = require('./routes/chat')(server, passport);



//ADD MIDDLEWARE AND ROUTES TO APP

//Add middleware to the request pipeline
app.use(bodyParser.json());
app.use(passport.initialize());

//Allow cross-origin requests if we are doing dev work
if (process.env.NODE_ENV === 'development') {
    app.use(cors());
}

//Add the api routes
app.use('/api/authentication', authenticationRouter);
app.use('/api/chat', chatRouter);

//Add the public files (Angular app), and redirect all uncaught GET requests to the app as well
app.use(express.static(`${__dirname}/public`));
app.get('*', (req, res) => res.sendFile(`${__dirname}/public/index.html`));

//Add the error handling middleware
app.use(errorLogger);
app.use(errorHandler);



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

'use strict';

/**
 * node modules
 */
const express = require('express');
require('dotenv').config();
const session = require('express-session');
const MongoStore = require('connect-mongo');

/**
 * custom modules
 */
const register = require('./src/routes/register_route');
const login = require('./src/routes/login_route');
const logout = require('./src/routes/logout_route');
const home = require('./src/routes/home_route');
const ticket = require('./src/routes/ticket_route');
const booking = require('./src/routes/booking_route');
const cart = require('./src/routes/cart_route');
const admin = require('./src/routes/admin_route');
const { connectDB, disconnectDB } = require('./src/config/mongoose_config');

/**
 * initial express
 */
const app = express();

app.set('view engine', 'ejs'); 
app.use(express.static(`${__dirname}/public`));

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '10mb' }));

/**
 * instance for session storage
 */
const store = new MongoStore({
    mongoUrl: process.env.MONGO_CONNECTION_URI,
    collectionName: 'sessions',
    dbName: 'ticket-reservation'
})

/**
 * initial express session
 */
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store,
    cookie: {
        maxAge: Number(process.env.SESSION_MAX_AGE)
    }
}));


/** register page */
app.use('/register', register);

/** login page */
app.use('/login', login);

/** logout page */
app.use('/logout', logout);

/** home page */
app.use('/', home);

/** ticket page */
app.use('/tickets', ticket);

/** cart page */
app.use('/carts', cart);

/** booking page */
app.use('/bookings', booking);

/** admin page */
app.use('/admin', admin);

/**
 * start server
 */
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
    await connectDB(process.env.MONGO_CONNECTION_URI);
});

server.on('close', async () => { await disconnectDB(); });
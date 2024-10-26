const session = require('express-session');
const MongoStore = require('connect-mongo');

module.exports = () => {
    return session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: new MongoStore({
            mongoUrl: process.env.MONGO_CONNECTION_URI,
            collectionName: 'sessions',
            dbName: 'ticket-reservation'
        }),
        cookie: {
            maxAge: Number(process.env.SESSION_MAX_AGE)
        }
    });
};

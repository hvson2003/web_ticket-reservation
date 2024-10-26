const session = require('express-session');
const MongoStore = require('connect-mongo');

module.exports = (app) => {
    app.use(session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: process.env.MONGO_CONNECTION_URI,
            collectionName: 'sessions',
            dbName: 'ticket-reservation'
        }),
        cookie: {
            maxAge: Number(process.env.SESSION_MAX_AGE)
        }
    }));
};

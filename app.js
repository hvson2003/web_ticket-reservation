'use strict';

/**
 * node modules
 */
const express = require('express');
require('dotenv').config();

/**
 * custom modules
 */
const ticket = require('./routes/ticket_routes');
const { connectDB, disconnectDB } = require('./config/mongoose_config');


/**
 * initial express
 */
const app = express();

app.set('view engine', 'ejs'); 
app.use(express.static(`${__dirname}/public`));

app.use('/', ticket);


/**
 * start server
 */
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
    await connectDB(process.env.MONGO_CONNECTION_URI);
});

server.on('close', async () => { await disconnectDB(); });
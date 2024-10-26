'use strict';

require('dotenv').config();
const express = require('express');
const { connectDB, disconnectDB } = require('./src/config/mongoose_config');
const setupMiddlewares = require('./src/config/middlewares');
const setupRoutes = require('./src/routes/routes');
const sessionConfig = require('./src/config/session_config');

const app = express();
app.set('view engine', 'ejs');
app.use(express.static(`${__dirname}/public`));

setupMiddlewares(app);
app.use(sessionConfig());
setupRoutes(app);

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
    await connectDB(process.env.MONGO_CONNECTION_URI);
});

server.on('close', async () => {
    await disconnectDB();
});

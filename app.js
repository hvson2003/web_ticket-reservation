'use strict';

require('dotenv').config();
const express = require('express');
const { connectDB, disconnectDB } = require('./src/config/mongoose_config');
const setupMiddlewares = require('./src/config/middlewares');
const setupRoutes = require('./src/routes/routes');
const sessionConfig = require('./src/config/session_config');

// Initialize express app
const app = express();
app.set('view engine', 'ejs');
app.use(express.static(`${__dirname}/public`));

// Setup middlewares and routes
setupMiddlewares(app);
sessionConfig(app);
setupRoutes(app);

// Schedule module
require('./src/utils/cancel_experied_booking');

// Server setup with graceful shutdown
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, async () => {
    try {
        await connectDB(process.env.MONGO_CONNECTION_URI);
        console.log(`Server is running on port ${PORT}`);
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
});

const gracefulShutdown = async () => {
    try {
        await disconnectDB();
        server.close(() => {
            console.log('Server shut down gracefully');
            process.exit(0);
        });
    } catch (error) {
        console.error('Error during shutdown:', error);
        process.exit(1);
    }
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

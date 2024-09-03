/**
 * @license Apache-2.0
*/

'use strict';

const cron = require('node-cron');
const Cart = require('../models/cart_model');

cron.schedule('*/5 * * * *', async () => {
    const now = new Date();
    const expiryTime = new Date(now.getTime() - 5 * 60 * 1000); // 5 minutes

    try {
        const result = await Cart.deleteMany({
            updatedAt: { $lt: expiryTime }
        });

        console.log(`Deleted ${result.deletedCount} expired carts.`);
    } catch (error) {
        console.error('Error cleaning up expired carts:', error);
    }
});

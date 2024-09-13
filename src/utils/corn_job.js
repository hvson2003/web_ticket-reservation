/**
 * @license Apache-2.0
 */

'use strict';

const cron = require('node-cron');
const Booking = require('../models/booking_model');

cron.schedule('*/5 * * * *', async () => {
    const now = new Date();
    const expiryTime = new Date(now.getTime() - 5 * 60 * 1000); // 5 minutes

    try {
        const result = await Booking.updateMany({
            status: 'pending',
            booking_time: { $lt: expiryTime }
        }, {
            $set: { status: 'canceled' } 
        });

        console.log(`Canceled ${result.modifiedCount} expired bookings.`);
    } catch (error) {
        console.error('Error updating expired bookings:', error);
    }
});

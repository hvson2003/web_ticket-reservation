/**
 * @license Apache-2.0
*/

'use strict';

const Payment = require('../models/payment_model');
const Booking = require('../models/booking_model');

const createPayment = async (req, res) => {
    try {
        const { booking_ids, total_cost } = req.body;

        const payment = new Payment({
            user_id: req.session.user.user_id, 
            booking_ids,
            total_cost,
            status: 'paid'
        });

        await payment.save();

        await Booking.deleteMany({ _id: { $in: booking_ids } });

        res.json({ success: true, payment_id: payment._id });
    } catch (error) {
        console.error('Error creating payment:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

module.exports = {
    createPayment
} 
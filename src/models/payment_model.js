'use strict';

/**
 * node modules
 */
const mongoose = require('mongoose');

/**
 * mongoose schema for payments
 */
const paymentSchema = new mongoose.Schema({
    booking_id: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Booking',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    payment_time: {
        type: Date,
        default: Date.now
    },
    payment_method: {
        type: String,
        enum: ['credit_card', 'paypal', 'bank_transfer'],
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Payment', paymentSchema);
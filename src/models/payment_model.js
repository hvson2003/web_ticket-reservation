'use strict';

/**
 * node modules
 */
const mongoose = require('mongoose');

/**
 * mongoose schema for payments
 */
const paymentSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User',
        required: true
    },
    booking_ids: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Booking',
        required: true
    }],
    total_cost: {
        type: Number,
        required: true
    },
    payment_time: {
        type: Date,
        default: Date.now
    },
    status: { 
        type: String, 
        required: true,
        enum: ['paid', 'cancel'], 
        default: 'paid' 
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Payment', paymentSchema);
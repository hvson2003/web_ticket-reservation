'use strict';

/**
 * node modules
 */
const mongoose = require('mongoose');

/**
 * mongoose schema for bookings
 */
const bookingSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User',
        required: true
    },
    tickets: [{
        _id: false,
        ticket_id: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'Ticket',
            required: true
        },
        quantity: {
            type: Number,
            required: true
        }
    }],
    total_cost: {
        type: Number,
        required: true
    },
    booking_time: {
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

module.exports = mongoose.model('Booking', bookingSchema);

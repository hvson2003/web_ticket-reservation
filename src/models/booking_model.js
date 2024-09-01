'use strict';

/**
 * node modules
 */
const mongoose = require('mongoose');

/**
 * mongoose schema for bookings
 */
const bookingSchema = new mongoose.Schema({
    user_name: {
        type: String,
        required: true
    },
    ticket_id: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Ticket',
        required: true
    },
    booking_time: {
        type: Date,
        default: Date.now
    },
    confirmation_time: {
        type: Date
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled'],
        default: 'pending'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Booking', bookingSchema);

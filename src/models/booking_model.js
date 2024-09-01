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
        enum: ['pending', 'removed'],
        default: 'pending'
    }
}, {
    timestamps: true
});

bookingSchema.index({ user_id: 1, ticket_id: 1 }, { unique: true });

module.exports = mongoose.model('Booking', bookingSchema);

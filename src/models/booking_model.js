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
    quantity: {
        type: Number,
        required: true,
        default: 1,
        min: 1
    },
    booking_time: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

bookingSchema.index({ user_id: 1, ticket_id: 1 }, { unique: true });

module.exports = mongoose.model('Booking', bookingSchema);

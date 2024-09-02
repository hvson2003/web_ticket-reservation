'use strict';

/**
 * node modules
 */
const mongoose = require('mongoose');

/**
 * mongoose schema for bookings
 */
const cartSchema = new mongoose.Schema({
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
    }
}, {
    timestamps: true
});

cartSchema.index({ user_id: 1, ticket_id: 1 }, { unique: true });

module.exports = mongoose.model('Cart', cartSchema);

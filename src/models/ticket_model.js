'use strict';

/**
 * node modules
 */
const mongoose = require('mongoose');

/**
 * mongoose schema for tickets
 */
const ticketSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    remaining_quantity: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Ticket', ticketSchema);

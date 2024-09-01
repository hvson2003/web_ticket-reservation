'use strict';

const Booking = require('../models/booking_model');
const Ticket = require('../models/ticket_model');

const addTicket = async (req, res) => {    
    try {
        const { ticketId } = req.params; 
        const userId = req.session.user.user_id;

        if (!ticketId || !userId) {
            return res.status(400).json({ success: false, error: 'Invalid request parameters.' });
        }

        const existingBooking = await Booking.findOne({ ticket_id: ticketId, user_id: userId });
        if (existingBooking) {
            return res.status(400).json({ success: false, error: 'Ticket already added to your booking.' });
        }

        const ticket = await Ticket.findById(ticketId);
        if (!ticket) {
            return res.status(404).json({ success: false, error: 'Ticket not found.' });
        }

        if (ticket.remaining_quantity <= 0) {
            return res.status(400).json({ success: false, error: 'No tickets available.' });
        }

        const newBooking = new Booking({
            ticket_id: ticketId,
            user_id: userId,
            status: 'pending'
        });

        await newBooking.save();

        ticket.remaining_quantity -= 1;
        await ticket.save();

        res.json({ success: true });
    } catch (error) {
        console.error('Error adding ticket to booking:', error);
        res.status(500).json({ success: false, error: 'An error occurred. Please try again later.' });
    }
};

module.exports = {
    addTicket
};

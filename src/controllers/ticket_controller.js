'use strict';

const Booking = require('../models/cart_model');
const Ticket = require('../models/ticket_model');

const addTicket = async (req, res) => {    
    try {
        const { ticketId } = req.params; 
        const userId = req.session.user.user_id;

        if (!ticketId || !userId) {
            return res.status(400).json({ message: 'Invalid request parameters.' });
        }

        const existingBooking = await Booking.findOne({ ticket_id: ticketId, user_id: userId });
        if (existingBooking) {
            return res.status(400).json({ message: 'Ticket already added to your booking.' });
        }

        const ticket = await Ticket.findById(ticketId);
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found.' });
        }

        if (ticket.remaining_quantity <= 0) {
            return res.status(400).json({ message: 'No tickets available.' });
        }

        const newBooking = new Booking({
            ticket_id: ticketId,
            user_id: userId,
        });

        await newBooking.save();

        ticket.remaining_quantity -= 1;
        await ticket.save();

        res.sendStatus(200);
    } catch (error) {
        console.error('Error adding ticket to booking:', error);
        throw error;
    }
};

module.exports = {
    addTicket
};

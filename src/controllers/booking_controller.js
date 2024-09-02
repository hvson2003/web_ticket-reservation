/**
 * @license Apache-2.0
*/

'use strict';

const Booking = require('../models/booking_model');
const Cart = require('../models/cart_model');

const addBooking = async (req, res) => {
    try {
        const { tickets_info, total_cost } = req.body;

        // const tickets = tickets_info.map((ticket_id, index) => ({
        //     ticket_id,
        //     quantity: quantity[index]
        // }));

        const booking = new Booking({
            user_id: req.session.user.user_id,
            tickets: tickets_info,
            total_cost,
            status: 'paid'
        });

        await booking.save();

        const ticketIds = tickets_info.map(ticket => ticket.ticket_id);
        await Cart.deleteMany({ 
            ticket_id: { $in: ticketIds }, 
            user_id: req.session.user.user_id 
        });

        res.json({ success: true, booking_id: booking._id });
    } catch (error) {
        console.error('Error adding booking:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};


module.exports = {
    addBooking
} 
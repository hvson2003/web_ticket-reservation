/**
 * @license Apache-2.0
*/

'use strict';

const Booking = require('../models/booking_model');
const Cart = require('../models/cart_model');
const getPagination = require('../utils/get_pagination_utils');

/**
 * Render the booked list
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 */
const renderBookedTickets = async (req, res) => {
    try {
        const totalBookedTicket = await Booking.countDocuments({ user_id: req.session.user.user_id });
        const pagination = getPagination('/', req.params, 15, totalBookedTicket);

        const allBookings = await Booking.find({ user_id: req.session.user.user_id })
            .populate('tickets.ticket_id')
            .limit(pagination.limit)
            .skip(pagination.skip)
            .exec();        
        
        res.render('./pages/booked_tickets', {
            sessionUser: req.session.user,
            allBookings,
            pagination
        });
    } catch (error) {
        console.error('Error rendering booking page: ', error.message);
        throw error;
    }
}


/**
 * Create new booking
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 */
const addBooking = async (req, res) => {
    try {
        const userId = req.session.user && req.session.user.user_id ? req.session.user.user_id : '';

        const { tickets_info, total_cost } = req.body;

        const booking = new Booking({
            user_id: userId,
            tickets: tickets_info,
            total_cost,
            status: 'paid'
        });

        await booking.save();

        const ticketIds = tickets_info.map(ticket => ticket.ticket_id);
        await Cart.deleteMany({ 
            ticket_id: { $in: ticketIds }, 
            user_id: userId
        });

        res.json({ success: true, booking_id: booking._id });
    } catch (error) {
        console.error('Error adding booking:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};


module.exports = {
    renderBookedTickets,
    addBooking
} 
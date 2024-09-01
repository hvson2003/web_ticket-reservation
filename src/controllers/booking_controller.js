/**
 * @license Apache-2.0
*/

'use strict';

/**
 * custom modules
 */
const Booking = require('../models/booking_model');
const Ticket = require('../models/ticket_model');
const getPagination = require('../utils/get_pagination_utils');

/**
 * Render the booking page
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 */
const renderBooking = async (req, res) => {
    try {
        const totalBookings = await Booking.countDocuments();
        const pagination = getPagination('/', req.params, 15, totalBookings);  

        const allBookings = await Booking.find({ user_id: req.session.user.user_id })
            .populate('ticket_id')
            .limit(pagination.limit)
            .skip(pagination.skip);
        
        res.render('./pages/booking', {
            sessionUser: req.session.user,
            allBookings,
            pagination
        }); 
    } catch (error) {
        console.error('Error rendering home page: ', error.message);
        throw error;
    }

}

module.exports = {
    renderBooking
} 
/**
 * @license Apache-2.0
*/

'use strict';

/**
 * custom modules
 */
const Ticket = require('../models/ticket_model');
const Booking = require('../models/cart_model');
const getPagination = require('../utils/get_pagination_utils');

/**
 * Render the ticket page
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 */
const renderHome = async (req, res) => {
    try {
        const userId = req.session.user && req.session.user.user_id ? req.session.user.user_id : '';

        const totalTickets = await Ticket.countDocuments();
        const pagination = getPagination('/', req.params, 15, totalTickets); 

        const allTickets = await Ticket.find()
            .select('id name price remaining_quantity status')
            .limit(pagination.limit)
            .skip(pagination.skip);
        
        let allTicketsWithBookingStatus;

        if (userId) {
            allTicketsWithBookingStatus = await Promise.all(allTickets.map(async (ticket) => {
                const isBooked = await checkIfTicketBooked(userId, ticket._id);
                return {
                    ...ticket._doc,
                    isBooked
                };
            }));
        } else {
            allTicketsWithBookingStatus = allTickets;
        }

        res.render('./pages/home', {
            sessionUser: req.session.user,
            allTickets: allTicketsWithBookingStatus,
            pagination
        }); 
    } catch (error) {
        console.error('Error rendering home page: ', error.message);
        throw error;
    }
};


const checkIfTicketBooked = async (userId, ticketId) => {
    try {
        const booking = await Booking.findOne({ user_id: userId, ticket_id: ticketId });
        
        return booking ? true : false;
    } catch (error) {
        console.error('Error checking booking status:', error);
        return false;
    }
};

module.exports = {
    renderHome,
    checkIfTicketBooked
} 
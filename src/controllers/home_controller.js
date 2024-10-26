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
        
        const pagination = getPagination('/', req.params, 9, totalTickets);             

        const allTickets = await Ticket.find()
            .select('id name price remaining_quantity')
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

const addTicket = async (req, res) => {    
    try {
        const { ticketId } = req.params; 
        const userId = req.session.user ? req.session.user.user_id : '';

        if (!userId) {
            return res.status(400).json({ message: 'Please login to add ticket.' });
        }

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


const checkIfTicketBooked = async (userId, ticketId) => {
    try {
        const booking = await Booking.findOneAndUpdate(
            { ticket_id: ticketId, isLocked: false },
            { user_id: userId, isLocked: true },
            { new: true }
        );

        if (!booking) {
            return res.status(409).json({ message: 'Ticket is already booked or locked by another user !' });
            return false;
        }

        booking.status = 'booked';
        booking.isLocked = false;
        await booking.save();
        
        return true;
    } catch (error) {
        console.error("Error booking ticket:", error);
        return false;
    }
};

module.exports = {
    renderHome,
    addTicket,
    checkIfTicketBooked
} 
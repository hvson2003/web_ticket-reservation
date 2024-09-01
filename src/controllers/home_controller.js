/**
 * @license Apache-2.0
*/

'use strict';

/**
 * custom modules
 */
const Ticket = require('../models/ticket_model');
const getPagination = require('../utils/get_pagination_utils');

/**
 * Render the ticket page
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 */
const renderTicket = async (req, res) => {
    try {
        const totalTickets = await Ticket.countDocuments();
        const pagination = getPagination('/', req.params, 15, totalTickets); 

        const allTickets = await Ticket.find()
        .select('id name price remaining_quantity status')
        .limit(pagination.limit)
        .skip(pagination.skip);

        res.render('./pages/home', {
            sessionUser: req.session.user,
            allTickets,
            pagination
        }); 
    } catch (error) {
        console.error('Error rendering home page: ', error.message);
        throw error;
    }

}

module.exports = {
    renderTicket
} 
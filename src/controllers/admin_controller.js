'use strict';

const Ticket = require('../models/ticket_model');
const getPagination = require('../utils/get_pagination_utils');

const renderAdmin = async (req, res) => {    
    try {
        const totalTickets = await Ticket.countDocuments();
        const pagination = getPagination('/', req.params, 15, totalTickets); 
    
        const allTickets = await Ticket.find()
        .select('id name price remaining_quantity status')
        .limit(pagination.limit)
        .skip(pagination.skip);
    
        res.render('./pages/admin', {
            allTickets,
            pagination
        }); 
    } catch (error) {
        console.error('Error rendering admin page: ', error.message);
        throw error;
    }

};

const createTicket = async (req, res) => {    
    const { name, price, remaining_quantity } = req.body;

    try {
        const newTicket = new Ticket({
            name,
            price,
            remaining_quantity,
        });

        await newTicket.save();
        res.redirect('/admin');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

module.exports = {
    renderAdmin,
    createTicket
};

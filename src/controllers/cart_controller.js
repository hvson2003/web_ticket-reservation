/**
 * @license Apache-2.0
*/

'use strict';

/**
 * custom modules
 */
const Cart = require('../models/cart_model');
const Ticket = require('../models/ticket_model');
const Booking = require('../models/booking_model');

const getPagination = require('../utils/get_pagination_utils');

/**
 * Render the cart page
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 */
const renderCart = async (req, res) => {
    try {
        const user = req.session.user || {};

        if (!user.userAuthenticated) {
            return res.redirect('/');
        }
        
        const userId = user.user_id || '';
        
        const totalCards = await Cart.countDocuments();
        const pagination = getPagination('/', req.params, 15, totalCards);  

        const allCarts = await Cart.find({
                user_id: userId,
            })
            .populate('ticket_id')
            .sort({ createdAt: 'desc' })
            .limit(pagination.limit)
            .skip(pagination.skip);
        
        res.render('./pages/cart', {
            sessionUser: req.session.user,
            allCarts,
            pagination
        }); 
    } catch (error) {
        console.error('Error rendering cart page: ', error.message);
        throw error;
    }
}

/**
 * Delete cart card
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 */
const removeCart = async (req, res) => {
    try {
        const { cartId } = req.params;
    
        const cart = await Cart.findById(cartId);
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
    
        const ticket = await Ticket.findById(cart.ticket_id);
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }
        
        ticket.remaining_quantity += cart.quantity;
        await ticket.save();

        await Cart.findByIdAndDelete(cartId);
    
        res.sendStatus(200);
    } catch (error) {
        console.error('Error removing cart:', error);
        throw error
    }
    
};


/**
 * Add all tickets to the booking list
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 */
const addToBooking = async (req, res) => {
    try {
        const cartIds = req.body.carts || [];
        if (cartIds.length === 0) {
            return res.redirect('back');
        }

        const carts = await Cart.find({ _id: { $in: cartIds } }).populate('ticket_id');

        if (carts.length === 0) {
            return res.redirect('back');
        }

        const booking_info = carts.map(cart => ({
            ticket_id: cart.ticket_id._id,
            name: cart.ticket_id.name,
            price: cart.ticket_id.price,
            quantity: cart.quantity
        }));

        const booking = new Booking({
            user_id: req.session.user.user_id,
            tickets: booking_info,
            total_cost: booking_info.reduce((sum, ticket) => sum + (ticket.price * ticket.quantity), 0),
            status: 'pending'
        });

        await booking.save();

        await Cart.deleteMany({ _id: { $in: cartIds }, user_id: req.session.user.user_id });

        res.redirect('/bookings'); 
    } catch (error) {
        console.error('Error when add cart to booking:', error);
    }
};


/**
 * Check ticket availability
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 */
const checkTicketAvailability = async (req, res) => {
    const { cartId } = req.params;

    try {
        const cart = await Cart.findById(cartId);
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const ticket = await Ticket.findById(cart.ticket_id);
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }

        const isAvailable = ticket.remaining_quantity > 0;
        return res.json({ isAvailable });
    } catch (error) {
        console.error('Error checking ticket availability:', error);
        throw error;
    }
};


/**
 * Update ticket quantity in cart
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 */
const updateCartQuantity = async (req, res) => {    
    const { cartId } = req.params;
    const { status } = req.body;

    try {
        const cart = await Cart.findById(cartId);
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        if (status == 'decrement') {
            cart.quantity -= 1;
            await cart.save();
            
            const ticket = await Ticket.findById(cart.ticket_id);
            ticket.remaining_quantity += 1;
            await ticket.save();
    
            res.sendStatus(200);
        } else if (status == 'increment') {
            const ticket = await Ticket.findById(cart.ticket_id);
            if (ticket.remaining_quantity > 0) {
                cart.quantity += 1;
                await cart.save();            
                
                ticket.remaining_quantity -= 1;
                await ticket.save();
                res.sendStatus(200);
            } else {
                return res.status(404).json({ message: 'No ticket available!' });
            }
        } else {
            return res.status(404).json({ message: 'Update quantity ticket fail!' });
        }
    } catch (error) {
        console.error('Error updating cart quantity:', error);
        throw error;
    }
};

module.exports = {
    renderCart,
    addToBooking,
    removeCart,
    checkTicketAvailability,
    updateCartQuantity
} 
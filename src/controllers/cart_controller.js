/**
 * @license Apache-2.0
*/

'use strict';

/**
 * custom modules
 */
const Cart = require('../models/cart_model');
const Ticket = require('../models/ticket_model');

const getPagination = require('../utils/get_pagination_utils');

/**
 * Render the cart page
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 */
const renderCart = async (req, res) => {
    try {
        const userId = req.session.user && req.session.user.user_id ? req.session.user.user_id : '';
        
        if (!userId) {
            console.error("User ID is missing or invalid");
            return res.status(400).json({ error: "User ID is missing or invalid" });
        }
        
        const totalCards = await Cart.countDocuments();
        const pagination = getPagination('/', req.params, 15, totalCards);  

        const allCarts = await Cart.find({
                user_id: userId,
            })
            .populate('ticket_id')
            .sort({ updatedAt: 'desc' })
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
 * Delete cart
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 */
const removeCart = async (req, res) => {
    try {
        const { id } = req.params;
    
        const cart = await Cart.findById(id);
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
    
        const ticket = await Ticket.findById(cart.ticket_id);
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }
    
        await Cart.findByIdAndDelete(id);
    
        ticket.remaining_quantity += 1;
        await ticket.save();
    
        res.sendStatus(200);
    } catch (error) {
        console.error('Error removing cart:', error);
        res.status(500).json({ message: 'Server error' });
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
        return res.status(500).json({ message: 'Server error' });
    }
};


/**
 * Update quantity cart
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
    removeCart,
    checkTicketAvailability,
    updateCartQuantity
} 
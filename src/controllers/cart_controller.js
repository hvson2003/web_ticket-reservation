/**
 * @license Apache-2.0
*/

'use strict';

/**
 * custom modules
 */
const Cart = require('../models/cart_model');
const getPagination = require('../utils/get_pagination_utils');

/**
 * Render the cart page
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 */
const renderCart = async (req, res) => {
    try {
        const userId = req.session.user && req.session.user.user_id ? req.session.user.user_id : '';

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
 * delete cart
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 */
const removeCart = async (req, res) => {
    try {
        const { id } = req.params;
        await Cart.findByIdAndDelete(id);
        res.json({ success: true });
    } catch (error) {
        console.error('Error removing cart:', error);
        res.status(500).json({ success: false, error: 'An error occurred while removing the cart.' });
    }
};


/**
 * Update quantity cart
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 */
const updateCartQuantity = async (req, res) => {    
    const { cartId } = req.params;
    const { quantity } = req.body;

    try {
        const cart = await Cart.findById(cartId);
        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        cart.quantity = quantity;
        await cart.save();

        res.json({ success: true });
    } catch (error) {
        console.error('Error updating cart quantity:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    renderCart,
    removeCart,
    updateCartQuantity
} 
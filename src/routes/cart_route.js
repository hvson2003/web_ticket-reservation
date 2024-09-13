/**
 * @license Apache-2.0
 */

'use strict';

/**
 * node modules
 */
const router = require('express').Router();

/**
 * custom modules
 */
const { renderCart, addToBooking, removeCart, checkTicketAvailability, updateCartQuantity } = require('../controllers/cart_controller');

// Route to render cart page
router.get('/', renderCart);

// Route to add new booking
router.post('/add-to-booking', addToBooking);

// Route to delete cart item
router.delete('/remove/:id', removeCart);

// Route to update ticket quantity in cart 
router.patch('/update-quantity/:cartId', updateCartQuantity);

// Route check ticket availability
router.get('/check-availability/:cartId', checkTicketAvailability);


module.exports = router;

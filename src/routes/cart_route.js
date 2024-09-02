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
const { renderCart, removeCart, updateCartQuantity } = require('../controllers/cart_controller');

// Route to render cart page
router.get('/', renderCart);

// Route to delete cart item
router.delete('/remove/:id', removeCart);

// Route to update cart item quantity
router.patch('/update/:cartId', updateCartQuantity);

module.exports = router;

/**
 * @license Apache-2.0
 */

'use strict';

/**
 * node modules
 */
const router = require('express').Router();

/**
 * custome modules
 */
const { renderBookingList, cancelBooking, renderCheckout, handleCheckout, cancelCheckout } = require('../controllers/booking_controller');

// Route to render the page showing booked tickets
router.get('/', renderBookingList);

// Route to cancel a booking by its ID
router.delete('/:id/cancel', cancelBooking);

// Route to render the checkout page
router.get('/checkout', renderCheckout);

// Route to handle successful checkout
router.get('/checkout/success', handleCheckout);

// Route to render the page for canceled checkout
router.get('/checkout/cancel', cancelCheckout);

module.exports = router;


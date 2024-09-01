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
const { renderBooking, removeBooking, updateBookingQuantity } = require('../controllers/booking_controller');

// Route render booking page
router.get('/', renderBooking);

// Route delete booking
router.delete('/remove/:id', removeBooking);

// Route update quantity booking
router.patch('/update/:bookingId', updateBookingQuantity);

module.exports = router;

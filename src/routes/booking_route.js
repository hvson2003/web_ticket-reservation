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
const { renderBookedTickets, addBooking, cancelBooking } = require('../controllers/booking_controller');

// Route render booked ticket page
router.get('/', renderBookedTickets);

// Route add booking
router.post('/create', addBooking);

// Route cancel booking
router.post('/:id/cancel', cancelBooking);


module.exports = router;


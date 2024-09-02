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
const { addBooking } = require('../controllers/booking_controller');

// Route create payment
router.post('/create', addBooking);

module.exports = router;


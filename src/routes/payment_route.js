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
const { createPayment } = require('../controllers/payment_controller');

// Route create payment
router.post('/create', createPayment);

module.exports = router;


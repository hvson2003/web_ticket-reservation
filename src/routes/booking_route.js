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
const { renderBooking } = require('../controllers/booking_controller');

router.get('/', renderBooking);

module.exports = router;
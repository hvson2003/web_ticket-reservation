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
const { renderTicket } = require('../controllers/ticket_controller');

router.get('/', renderTicket);

module.exports = router;
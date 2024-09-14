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
const { renderHome, addTicket } = require('../controllers/home_controller');

// Route to render home page
router.get(['/', '/page/:pageNumber'], renderHome);

// POST route: add ticket to cart
router.post('/add-to-cart/:ticketId', addTicket);

module.exports = router;
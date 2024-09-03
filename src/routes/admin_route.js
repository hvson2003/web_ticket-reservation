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
const { renderAdmin, createTicket } = require('../controllers/admin_controller');

// Render to admin page
router.get('/', renderAdmin);

// Route to render cart page
router.post('/create-ticket', createTicket);

module.exports = router;

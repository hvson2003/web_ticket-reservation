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
const { renderLogin, postLogin } = require('../controllers/login_controller');

// GET route: Render the login form
router.get('/', renderLogin);

// POST route: Handles from submission for user login
router.post('/', postLogin);

module.exports = router;
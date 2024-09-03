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
const { renderHome } = require('../controllers/home_controller');

router.get('/', renderHome);

module.exports = router;
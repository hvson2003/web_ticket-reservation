/**
 * @license Apache-2.0
*/

'use strict';
/**
 * Middleware function to check if user is authenticated.
 * @param {object} req 
 * @param {object} res 
 * @param {function} next 
 */
const userAuth = (req, res, next) => {
    // rettrieves the 'userAuthenticated' property from the 'user' 'session' object. If the 'session.user' object is not defined or is empty, it defaults to an empty object ('{}'). This allows safe access to 'userAuthenticated' without throwing errors due to undefined objects or properties.
    const { userAuthenticated } = req.session.user || {};

    // Handle case where user is anthenticated
    if (userAuthenticated) return next();

    // Redirect to registration page if user is not authenticated
    res.redirect('/login');
}

module.exports = userAuth;
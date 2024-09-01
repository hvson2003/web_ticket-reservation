/**
 * @license Apache-2.0
*/

'use strict';


/**
 * Logout the userby destroying the session and redirecting to the home page.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 */
const logout = async (req, res) => {
    try {
        req.session.destroy();
        res.redirect('/');
    } catch (error) {
        // Log and throw error
        console.error('Error logout: ', error.message);
        throw error;
    }
}

module.exports = logout;
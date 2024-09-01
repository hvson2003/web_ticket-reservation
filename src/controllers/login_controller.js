/**
 * @license Apache-2.0
*/

'use strict';

/**
 * node modules
 */
const bcrypt = require('bcryptjs');

/**
 * custom modules
 */
const User = require('../models/user_model');

/**
 * Render the login page
 * 
 * @param {object} req - The HTTP request object
 * @param {object} res - The HTTP response object
 */
const renderLogin = (req, res) => {
    // const { userAuthenticated } = req.session.user || {};

    // // Handles case when user already logged in
    // if (userAuthenticated) {
    //     return res.redirect('/')
    // }

    res.render('./pages/login');
}

/**
 * Handles the login process for a user
 * 
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {Promise<void>} - A Promise that representing the asynchronous operation
 */

const postLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const currentUser = await User.findOne({ email });
        if (!currentUser) {
            return res.status(400).json({ message: 'No user found with this email address !' });
        }
        const passwordIsValid = await bcrypt.compare(password, currentUser.password);
        if (!passwordIsValid) {
            return res.status(400).json({ message: 'Invalid password! Please ensure you entered the correct password and try again !' })
        }

        req.session.user = {
            userAuthenticated: true,
            name: currentUser.name,
            username: currentUser.username,
        }

        return res.redirect('/');

    } catch (error) {
        console.log('postLogin: ', error.message);
        throw error;
    }
}

module.exports = {
    renderLogin,
    postLogin
}
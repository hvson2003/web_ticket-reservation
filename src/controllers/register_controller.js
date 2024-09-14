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
 * Render the register page
 * 
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 */
const renderRegister = (req, res) => {
    const { userAuthenticated } = req.session.user || {};

    if (userAuthenticated) {
        return res.redirect('/')
    }
    
    res.render('./pages/register');
}

/**
 * Handles the register process for a new user
 * 
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {Promise<void>} - A Promise that resolves after register process is completed
 * @throws {Error} - If an error occurs during register process.
 */
const postRegister = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({name, email, password: hashedPassword});
        res.redirect('/login')
    } catch (error) {
        if (error.code === 11000) {
            if (error.keyPattern.email) {
                return res.status(400).json({ message: 'This email is already associated with an account !' });
            }
        } else {
            return res.status(400).send({ message: `Failed to register user !<br>${error.message}` });
        }

        // Log and throw error if any occurs during register process
        console.log('postRegister: ', error.message);
        throw error;
    }
}

module.exports = {
    renderRegister,
    postRegister
}
const express = require('express');

const registerRoute = require('./register_route');
const loginRoute = require('./login_route');
const logoutRoute = require('./logout_route');
const homeRoute = require('./home_route');
const bookingRoute = require('./booking_route');
const cartRoute = require('./cart_route');

module.exports = (app) => {
    app.use('/register', registerRoute);
    app.use('/login', loginRoute);
    app.use('/logout', logoutRoute);
    app.use('/', homeRoute);
    app.use('/carts', cartRoute);
    app.use('/bookings', bookingRoute);
};

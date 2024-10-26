const express = require('express');
const rateLimit = require('express-rate-limit');

module.exports = (app) => {
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json({ limit: '10mb' }));

    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 100
    });
    app.use(limiter);
};

/**
 * @license Apache-2.0
*/

'use strict';

const Booking = require('../models/booking_model');
const Cart = require('../models/cart_model');
const Ticket = require('../models/ticket_model');
const getPagination = require('../utils/get_pagination_utils');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); 

/**
 * Render the booked list
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 */
const renderBookedTickets = async (req, res) => {
    try {
        const totalBookedTicket = await Booking.countDocuments({ user_id: req.session.user.user_id });
        const pagination = getPagination('/', req.params, 15, totalBookedTicket);

        const allBookings = await Booking.find({ user_id: req.session.user.user_id })
            .populate('tickets.ticket_id')
            .sort({ updatedAt: 'desc' })
            .limit(pagination.limit)
            .skip(pagination.skip)
            .exec();        
        
        res.render('./pages/booked_tickets', {
            sessionUser: req.session.user,
            allBookings,
            pagination
        });
    } catch (error) {
        console.error('Error rendering booking page: ', error.message);
        throw error;
    }
}


/**
 * Create new booking
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 */
const addBooking = async (req, res) => {
    try {
        const userId = req.session.user && req.session.user.user_id ? req.session.user.user_id : '';
        const { tickets_info, total_cost } = req.body;

        // Tạo các line_items từ tickets_info
        const line_items = tickets_info.map(ticket => ({
            price_data: {
                currency: 'usd',
                product_data: {
                    name: ticket.name,
                },
                unit_amount: ticket.price * 100,  // Giá vé
            },
            quantity: ticket.quantity,
        }));

        // Tạo phiên thanh toán với Stripe
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items,
            mode: 'payment',
            success_url: `${process.env.BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}&user_id=${userId}`,
            cancel_url: `${process.env.BASE_URL}/cancel`,
        });

        // Chuyển hướng người dùng đến phiên thanh toán của Stripe
        res.redirect(session.url);

        // Phần này sẽ được xử lý sau khi thanh toán thành công tại endpoint /success
    } catch (error) {
        console.error('Error creating Stripe session:', error);
        res.status(500).send('Error creating payment session');
    }
};



const cancelBooking = async (req, res) => {
    try {
        const bookingId = req.params.id ? req.params.id : '';

        const booking = await Booking.findByIdAndUpdate(
            bookingId,
            { status: 'cancel' },
            { new: true }
        );

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        for (const ticket of booking.tickets) {
            await Ticket.findByIdAndUpdate(ticket.ticket_id, {
                $inc: { remaining_quantity: ticket.quantity }
            });
        }

        const refundAmount = booking.total_cost * 0.90;

        // Ở đây bạn có thể gửi thông báo hoặc thực hiện các bước cần thiết khác

        res.sendStatus(200);
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }

};

const renderCheckout = async (req, res) => {
    try {
        const tickets_info = JSON.parse(req.body.tickets_info);

        const total_cost = tickets_info.reduce((sum, ticket) => {
            return sum + (ticket.price * ticket.quantity);
        }, 0);

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: tickets_info.map(ticket => ({
                price_data: {
                    currency: 'usd',
                    product_data: { name: ticket.name },
                    unit_amount: ticket.price * 100,
                },
                quantity: ticket.quantity,
            })),
            mode: 'payment',
            success_url: `${process.env.BASE_URL}/bookings/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.BASE_URL}/bookings/checkout/cancel`,
            metadata: {
                user_id: req.session.user.user_id,
                tickets_info: JSON.stringify(tickets_info),
                total_cost: total_cost.toString()
            }
        });

        res.redirect(session.url);
    } catch (error) {
        console.error('Error creating checkout session:', error);
        res.status(500).send('An error occurred while creating the checkout session');
    }
};


const handleCheckout = async (req, res) => {
    try {
        const sessionId = req.query.session_id;
        if (!sessionId) {
            return res.status(400).send('Session ID is missing');
        }

        const session = await stripe.checkout.sessions.retrieve(sessionId);

        const tickets_info = JSON.parse(session.metadata.tickets_info);
        const total_cost = session.metadata.total_cost;
        const userId = session.metadata.user_id;

        const booking = new Booking({
            user_id: userId,
            tickets: tickets_info,
            total_cost,
            status: 'paid'
        });

        await booking.save();

        const ticketIds = tickets_info.map(ticket => ticket.ticket_id);

        await Cart.deleteMany({ 
            ticket_id: { $in: ticketIds }, 
            user_id: userId
        });

        res.render('./pages/success', {
            sessionUser: req.session.user
        }); 
    } catch (error) {
        console.error('Error processing the booking:', error);
        res.status(500).send('An error occurred while processing your booking');
    }
};

const cancelCheckout = async (req, res) => {
    res.render('./pages/cancel', {
        sessionUser: req.session.user
    }); 
};

module.exports = {
    renderBookedTickets,
    addBooking,
    cancelBooking,
    renderCheckout,
    handleCheckout,
    cancelCheckout
} 
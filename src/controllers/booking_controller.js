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
        const userId = req.session.user && req.session.user.user_id ? req.session.user.user_id : '';

        const totalBookedTicket = await Booking.countDocuments({ user_id: userId });
        const pagination = getPagination('/', req.params, 15, totalBookedTicket);

        const allBookings = await Booking.find({ user_id: userId })
        .populate('tickets.ticket_id')
        .sort({ createdAt: 'desc' })
        .limit(pagination.limit)
        .skip(pagination.skip);        

        res.render('./pages/booking', {
            sessionUser: req.session.user,
            allBookings,
            pagination
        });
    } catch (error) {
        console.error('Error rendering booking page: ', error.message);
        throw error;
    }
}

const addToBooking = async (req, res) => {
    try {
        const cartIds = req.body.carts || [];
        if (cartIds.length === 0) {
            return res.redirect('back');
        }

        const carts = await Cart.find({ _id: { $in: cartIds } }).populate('ticket_id');

        if (carts.length === 0) {
            return res.redirect('back');
        }

        const booking_info = carts.map(cart => ({
            ticket_id: cart.ticket_id._id,
            name: cart.ticket_id.name,
            price: cart.ticket_id.price,
            quantity: cart.quantity
        }));

        // Tạo một booking mới với trạng thái 'pending'
        const booking = new Booking({
            user_id: req.session.user.user_id,
            tickets: booking_info,
            total_cost: booking_info.reduce((sum, ticket) => sum + (ticket.price * ticket.quantity), 0),
            status: 'pending'
        });

        await booking.save();

        await Cart.deleteMany({ _id: { $in: cartIds }, user_id: req.session.user.user_id });

        res.redirect('/bookings'); 
    } catch (error) {
        console.error('Lỗi khi thêm vào danh sách đặt chỗ:', error);
        res.status(500).send('Đã xảy ra lỗi khi thêm vào danh sách đặt chỗ');
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

        if (booking.payment_intent_id) {
            await stripe.refunds.create({
                payment_intent: booking.payment_intent_id,
                amount: refundAmount,
                reason: 'requested_by_customer',
            });
        }
        res.sendStatus(200);
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }

};


const renderCheckout = async (req, res) => {
    try {
        const booking_info = JSON.parse(req.query.booking_info);
        
        if (!booking_info || !booking_info.id) {
            return res.status(400).send('Booking information is missing or invalid');
        }

        const bookingId = booking_info.id;

        const booking = await Booking.findById(bookingId).populate('tickets.ticket_id');
        if (!booking) {
            return res.status(404).send('Booking not found');
        }

        const total_cost = booking.total_cost;

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: booking_info.tickets.map(ticket => ({
                price_data: {
                    currency: 'vnd',
                    product_data: { name: ticket.name },
                    unit_amount: ticket.price,
                },
                quantity: ticket.quantity,
            })),
            mode: 'payment',
            success_url: `${process.env.BASE_URL}/bookings/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.BASE_URL}/bookings/checkout/cancel`,
            metadata: {
                booking_id: bookingId,
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

        const bookingId = session.metadata.booking_id;
        const total_cost = session.metadata.total_cost;

        const booking = await Booking.findById(bookingId).populate('tickets.ticket_id');
        if (!booking) {
            return res.status(404).send('Booking not found');
        }

        booking.status = 'paid';
        booking.payment_intent_id = session.payment_intent;

        await booking.save();

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
    addToBooking,
    cancelBooking,
    renderCheckout,
    handleCheckout,
    cancelCheckout
} 
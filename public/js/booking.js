/**
 * @license Apache-2.0
*/

'use strict';

/**
 * import modules
 */
import Snackbar from './snackbar.js';


document.addEventListener('DOMContentLoaded', () => {
    // Add event when click cancel booking
    const cancelButtons = document.querySelectorAll('.cancel-booking-btn');
    let bookingId;

    cancelButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            bookingId = button.getAttribute('data-booking-id');            
            const cancelModal = new bootstrap.Modal(document.getElementById('cancelModal'));
            cancelModal.show();
        });
    });

    // Add event for cancel dialog
    const confirmCancelButton = document.getElementById('confirmCancel');
    confirmCancelButton.addEventListener('click', async () => {        
        if (!bookingId) return;
        
        const response = await fetch(`/bookings/${bookingId}/cancel`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ bookingId })
        });

        if (response.ok) {
            setTimeout(() => {
                location.reload();
            }, 1000); 
            Snackbar({ message: 'Booking successfully canceled and refund processed !'});
        }

        if (response.status === 400) {
            const { message } = await response.json();
            Snackbar({ type: 'error', message });            
        }
    });


    // Add event for purchase button
    const makePaymentBtn = document.querySelectorAll('.make-payment-btn');

    makePaymentBtn.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();

            const bookingCard = button.closest('.booking');

            const booking_id = bookingCard.getAttribute('data-booking-id');

            const booking_info = {
                id: booking_id,
                tickets: []
            };

            bookingCard.querySelectorAll('.ticket-info').forEach(item => {
                const ticket_id = item.getAttribute('data-ticket-id');
                const quantity = item.getAttribute('data-quantity');
                const price = item.getAttribute('data-price');
                const name = item.getAttribute('data-name');

                booking_info.tickets.push({
                    ticket_id,
                    name,
                    price: parseFloat(price),
                    quantity: parseInt(quantity),
                });
            });            

            const form = document.createElement('form');
            form.method = 'GET'; 
            form.action = '/bookings/checkout';

            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = 'booking_info';
            input.value = JSON.stringify(booking_info);

            form.appendChild(input);
            document.body.appendChild(form);

            form.submit();
        });
    });

});

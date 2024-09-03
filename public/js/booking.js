/**
 * @license Apache-2.0
*/

'use strict';

/**
 * import modules
 */
import Snackbar from './snackbar.js';


document.addEventListener('DOMContentLoaded', () => {
    const cancelButtons = document.querySelectorAll('.cancel-booking');
    const confirmCancelButton = document.getElementById('confirmCancel');
    let bookingId;

    cancelButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            bookingId = button.getAttribute('data-booking-id');            
            const cancelModal = new bootstrap.Modal(document.getElementById('cancelModal'));
            cancelModal.show();
        });
    });

    confirmCancelButton.addEventListener('click', async () => {        
        if (!bookingId) return;
        
        const response = await fetch(`/bookings/${bookingId}/cancel`, {
            method: 'POST',
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
});

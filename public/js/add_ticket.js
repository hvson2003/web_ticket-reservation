/**
 * @license Apache-2.0
*/

'use strict';

/**
 * import modules
 */
import Snackbar from './snackbar.js';

document.addEventListener('DOMContentLoaded', function() {
    const addTicketButtons = document.querySelectorAll('.add-ticket-btn');

    addTicketButtons.forEach(button => {
        button.addEventListener('click', function() {
            const ticketId = this.getAttribute('data-ticket-id');

            fetch(`/tickets/${ticketId}/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    ticket_id: ticketId
                }),
            })            
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    Snackbar({ message: 'Ticket added to your booking!', type: 'success' });
                } else {
                    Snackbar({ message: data.error, type: 'error' });
                }
            })
            .catch(error => {
                console.error('Error:', error);
                Snackbar({ message: 'An error occurred. Please try again later.', type: 'error' });
            });
        });
    });
});

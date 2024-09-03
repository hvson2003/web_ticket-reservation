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
        button.addEventListener('click', async function() {
            const ticketId = this.getAttribute('data-ticket-id');

            const response = await fetch(`/tickets/${ticketId}/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    ticket_id: ticketId
                }),
            })    
            
            if (response.ok) {
                this.textContent = 'Booked'; 
                this.classList.remove('btn-primary');
                this.classList.add('btn-light');
                this.disabled = true; 
                Snackbar({ message: 'Ticket added to your cart!'});
            }

            if (response.status === 400) {
                const { message } = await response.json();
                Snackbar({ type: 'error', message });            
            }
        });
    });
});

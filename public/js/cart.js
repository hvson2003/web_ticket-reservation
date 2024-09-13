/**
 * @license Apache-2.0
 */

'use strict';

/**
 * import module
 */
import Snackbar from "./snackbar.js";

document.addEventListener('DOMContentLoaded', function () {
    const quantityControls = document.querySelectorAll('.quantity-control');

    // Handle increment and decrement button
    quantityControls.forEach(control => {
        const decrementBtn = control.querySelector('.decrement-btn');
        const incrementBtn = control.querySelector('.increment-btn');
        const quantityInput = control.querySelector('.quantity-input');
        const cartId = control.getAttribute('data-cart-id');       

        decrementBtn.addEventListener('click', function() {
            const currentValue = parseInt(quantityInput.value);
            if (currentValue > parseInt(quantityInput.min)) {
                quantityInput.value = currentValue - 1;                
                updateQuantity(cartId, 'decrement');
            }
        });

        incrementBtn.addEventListener('click', async function() {
            const currentValue = parseInt(quantityInput.value);
            const isAvailable = await checkTicketAvailability(cartId);
            
            if (isAvailable) {
                quantityInput.value = currentValue + 1;
                updateQuantity(cartId, 'increment');
            } else {
                Snackbar({
                    type: 'error',
                    message: 'Not enough tickets available!'
                });
            }
        });
    });

    async function checkTicketAvailability(cartId) {
        try {
            const response = await fetch(`/carts/check-availability/${cartId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });
    
            const data = await response.json();
            return data.isAvailable;
        } catch (error) {
            console.error('Error checking ticket availability:', error);
            return false; 
        }
    }

    async function updateQuantity(cartId, status) {
        try {
            const response = await fetch(`/carts/update-quantity/${cartId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify({ 
                    status
                })
            });

            if (response.status === 400) {
                const { message } = await response.json();
                Snackbar({
                    type: 'error',
                    message
                });
            }     
        } catch (error) {
            console.error('Error:', error);
        }
    }

    // Handle remove button
    const removeButtons = document.querySelectorAll('.remove-btn');
    removeButtons.forEach(button => {
        button.addEventListener('click', async function(e) {
            e.preventDefault();
            
            const cartId = button.getAttribute('data-cart-id');

            const response = await fetch(`/carts/remove/${cartId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });

            if (response.ok) {
                button.closest('.cart').remove();
            } else {
                const { message } = await response.json();
                Snackbar({ type: 'error', message });
            }
        });
    });

    // Handle add ticket button
    const addBookingButtons = document.querySelectorAll('.add-ticket-btn');
    addBookingButtons.forEach(button => {
        button.addEventListener('click', async function() {
            const ticketId = this.getAttribute('data-ticket-id');

            const response = await fetch(`/tickets/add-to-cart/${ticketId}`, {
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

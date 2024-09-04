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
                updateQuantity(cartId, quantityInput.value);
                updateModal();
            }
        });

        incrementBtn.addEventListener('click', function() {
            const currentValue = parseInt(quantityInput.value);
            quantityInput.value = currentValue + 1;            
            updateQuantity(cartId, quantityInput.value);
            updateModal();
        });
    });

    async function updateQuantity(cartId, quantity) {
        try {
            const response = await fetch(`/carts/update/${cartId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify({ quantity })
            });

            const data = await response.json();
            if (!response.ok) {
                console.error('Error updating quantity:', data.error);
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


    // Handle purchase button
    const makePaymentBtn = document.getElementById('make-payment-btn');
    makePaymentBtn.addEventListener('click', function(e) {
        e.preventDefault();
    
        const tickets_info = [];
        document.querySelectorAll('#cart-summary-list li').forEach(item => {
            const ticket_id = item.getAttribute('data-cart-id');
            const quantity = item.querySelector('.quantity-input').value;
            const price = item.querySelector('.quantity-input').getAttribute('data-price');
            const name = item.textContent.trim().split(' - ')[0];

            tickets_info.push({
                ticket_id,
                name,
                price: parseFloat(price),
                quantity: parseInt(quantity),
            });
        });
    
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = '/bookings/checkout';
    
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = 'tickets_info';
        input.value = JSON.stringify(tickets_info);
    
        form.appendChild(input);
        document.body.appendChild(form);
    
        form.submit(); 
    });
});

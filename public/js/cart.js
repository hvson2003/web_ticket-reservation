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

            try {
                const response = await fetch(`/carts/remove/${cartId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest'
                    }
                });

                const result = await response.json();
                if (response.ok) {
                    button.closest('.cart').remove();
                } else {
                    console.error(`Error: ${result.error}`);
                }
            } catch (error) {
                console.error(`Error removing cart: ${error}`);
            }
        });
    });

    // Handle purchase button
    const purchaseAllBtn = document.getElementById('purchase-all-btn');
    const purchaseModal = new bootstrap.Modal(document.getElementById('purchaseModal'));

    purchaseAllBtn.addEventListener('click', function() {
        purchaseModal.show();
    });

    // Handle confirm payment
    const confirmPaymentBtn = document.getElementById('confirm-purchase-btn');
    confirmPaymentBtn.addEventListener('click', async function () {
        const tickets_info = [...document.querySelectorAll('#cart-summary-list li')].map(li => ({
            ticket_id: li.getAttribute('data-cart-id'),
            quantity: li.querySelector('.quantity-input').value
        }));
        const totalCost = document.getElementById('totalCost').textContent;
    
        try {
            const response = await fetch('/bookings/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    tickets_info: tickets_info,
                    total_cost: parseFloat(totalCost.replace(/[,.]/g, ''))
                }),
            });

            const data = await response.json();
            if (data.success) {
                alert('Payment successful !');
                window.location.reload();
            } else {
                alert('Payment failed !');
            }
        } catch (error) {
            alert('An error occurred. Please try again later.');
            console.error('Error:', error);
        }
    });
});

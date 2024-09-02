/**
 * @license Apache-2.0
*/

'use strict';

/**
 * import module
 */
import Snackbar from "./snackbar.js";

document.addEventListener('DOMContentLoaded', function () {
    // Handle increment and decrement button
    const quantityControls = document.querySelectorAll('.quantity-control');

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

    function updateQuantity(cartId, quantity) {
        fetch(`/carts/update/${cartId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify({ quantity })
        })
        .then(response => response.json())
        .then(data => {
            // if (data.success) {
            //     console.log('Quantity updated successfully.');
            // } else {
            //     console.error('Error updating quantity:', data.error);
            // }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    // function updateModal() {
    //     const cartSummaryList = document.querySelector('#cart-summary-list');
    //     const totalCostElement = document.getElementById('totalCost');
    //     let totalCost = 0;
    
    //     const cartItems = cartSummaryList.querySelectorAll('li');
    
    //     cartItems.forEach(item => {
    //         const price = parseFloat(item.querySelector('.quantity-input').getAttribute('data-price'));
    //         const quantity = parseInt(item.querySelector('.quantity-input').value);
    //         const itemTotalCost = price * quantity;
    //         totalCost += itemTotalCost;
    
    //         // Update the displayed item total cost
    //         const itemTotalCostElement = item.querySelector('.item-total-cost');
    //         if (itemTotalCostElement) {
    //             itemTotalCostElement.textContent = itemTotalCost.toLocaleString('vi-VN') + ' đ';
    //         }
    //     });
    
    //     totalCostElement.textContent = totalCost.toLocaleString('vi-VN') + ' đ';
    // }
     

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
                    alert(`Error: ${result.error}`);
                }
            } catch (error) {
                console.error('Error removing cart:', error);
                alert('An error occurred. Please try again later.');
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
    confirmPaymentBtn.addEventListener('click', function () {
        const tickets_info = [...document.querySelectorAll('#cart-summary-list li')].map(li => ({
            ticket_id: li.getAttribute('data-cart-id'),
            quantity: li.querySelector('.quantity-input').value
        }));
        const totalCost = document.getElementById('totalCost').textContent;
    
        fetch('/bookings/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                tickets_info: tickets_info,
                total_cost: parseFloat(totalCost.replace(/[,.]/g, ''))
            }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Payment successful !');
                // Snackbar({
                //     message: 'Payment successful !'
                // });
                window.location.reload();
            } else {
                alert('Payment failed !');
                // Snackbar({
                //     type: 'error',
                //     message: 'Payment failed !'
                // });
            }
        })
        .catch(error => {
            alert('An error occurred. Please try again later.');

            // console.error('Error:', error);
            // Snackbar({
            //     type: 'error',
            //     message: 'An error occurred. Please try again later.'
            // });
        });
    });
});

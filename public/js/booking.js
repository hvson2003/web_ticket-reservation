document.addEventListener('DOMContentLoaded', function () {
    // Handle increment and decrement button
    const quantityControls = document.querySelectorAll('.quantity-control');

    quantityControls.forEach(control => {
        const decrementBtn = control.querySelector('.decrement-btn');
        const incrementBtn = control.querySelector('.increment-btn');
        const quantityInput = control.querySelector('.quantity-input');
        const bookingId = control.getAttribute('data-booking-id');

        decrementBtn.addEventListener('click', function() {
            const currentValue = parseInt(quantityInput.value);
            if (currentValue > parseInt(quantityInput.min)) {
                quantityInput.value = currentValue - 1;
                updateQuantity(bookingId, quantityInput.value);
            }
        });

        incrementBtn.addEventListener('click', function() {
            const currentValue = parseInt(quantityInput.value);
            quantityInput.value = currentValue + 1;            
            updateQuantity(bookingId, quantityInput.value);
        });
    });

    function updateQuantity(bookingId, quantity) {
        fetch(`/booking/update/${bookingId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify({ quantity })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log('Quantity updated successfully.');
            } else {
                console.error('Error updating quantity:', data.error);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }


    // Handle remove button
    const removeButtons = document.querySelectorAll('.remove-btn');
    removeButtons.forEach(button => {
        button.addEventListener('click', async function(e) {
            e.preventDefault();
            
            const bookingId = button.getAttribute('data-booking-id');

            try {
                const response = await fetch(`/booking/remove/${bookingId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest'
                    }
                });

                const result = await response.json();
                if (response.ok) {
                    button.closest('.card').remove();
                } else {
                    alert(`Error: ${result.error}`);
                }
            } catch (error) {
                console.error('Error removing booking:', error);
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
        const bookingIds = [...document.querySelectorAll('#booking-summary-list li')].map(li => li.getAttribute('data-booking-id'));
        const totalCost = document.getElementById('totalCost').textContent;
    
        fetch('/payments/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                booking_ids: bookingIds,
                total_cost: parseFloat(totalCost.replace(/,/g, ''))
            }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Payment successful!');
                window.location.reload();
            } else {
                alert('Payment failed: ' + data.error);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred. Please try again later.');
        });
    });
});

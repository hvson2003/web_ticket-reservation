/**
 * @license Apache-2.0
*/

'use strict';

/**
 * import module
 */
import Snackbar from "./snackbar.js";

document.addEventListener('DOMContentLoaded', function () {
    const $form = document.querySelector('[data-form]');
    const $submitBtn = document.querySelector('[data-submit-btn]');
    
    // Handling sign-up form submission
    $form.addEventListener('submit', async (event) => {
        event.preventDefault();
        $submitBtn.setAttribute('disabled', '');
    
        const formData = new FormData($form);
    
        //Handling case where password and confirm password fields doesn't match
        if (formData.get('password') !== formData.get('confirm_password')) {
            $submitBtn.removeAttribute('disabled');
            Snackbar({
                type: 'error',
                message: 'Please ensure your password and confirm password fields contain the same value!'
            });
            return;
        }
    
        const response = await fetch(`${window.location.origin}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams(Object.fromEntries(formData.entries())).toString()
        });
    
        if (response.ok) {
            return window.location = response.url;
        }
    
        if (response.status === 400) {
            $submitBtn.removeAttribute('disabled');
            const { message } = await response.json();
            Snackbar({
                type: 'error',
                message
            });
        }
    });    
});

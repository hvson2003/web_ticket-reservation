/**
 * @license Apache-2.0
*/

'use strict';

/**
 * import module
 */
import Snackbar from "./snackbar.js";

const $form = document.querySelector('[data-form]');
const $submitBtn = document.querySelector('[data-submit-btn]');

// Handing sign-up form submission
$form.addEventListener('submit', async (event) => {
    event.preventDefault();
    $submitBtn.setAttribute('disabled', '');

    const formData = new FormData($form);

    const response = await fetch(`${window.location.origin}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams(Object.fromEntries(formData.entries())).toString()
    });

    // Handle case where response status success
    if (response.ok) {
        return window.location = response.url;
    }

    // Handle case where response status is 400 (Bad request)
    if (response.status === 400) {
        $submitBtn.removeAttribute('disabled');
        const { message } = await response.json();
        Snackbar({
            type: 'error',
            message
        });
    }
});

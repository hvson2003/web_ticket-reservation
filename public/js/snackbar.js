/**
 * @license Apache-2.0
*/

'use strict';

const $snackbarWrapper = document.querySelector('[data-snackbar-wrapper]');
let lastTimeout = null;

/**
 * Creates a snackbar component and displays it with specified props
 * @param {Object} props - The properties for the snackbar
 * @param {string} props.message - The message to be displayed in the snackbar
 * @param {string} [props.type] - The type of the snackbar (optional), value 'error' | null
 */

const Snackbar = (props) => {
    // Create snackbar element
    const $snackbar = document.createElement('div');
    $snackbar.classList.add('snackbar');
    props.type && $snackbar.classList.add(props.type);
    $snackbar.innerHTML = `
        <p class="body-medium snackbar-text">
            ${props.message}
        </p>`;

    // Clear previous snackbar and append new one
    $snackbarWrapper.innerHTML = '';
    $snackbarWrapper.append($snackbar);

    // Remove snackbar after 10 seconds
    clearTimeout(lastTimeout);
    lastTimeout = setTimeout(() => {
        $snackbarWrapper.removeChild($snackbar);
    }, 10000);
}

export default Snackbar;
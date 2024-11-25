const cloudFunctionURL = "https://europe-west1-your-project-id.cloudfunctions.net/getCart";

// Show the loading spinner
function showLoadingSpinner() {
    const loadingSpinner = document.getElementById('loadingSpinner');
    loadingSpinner.style.display = 'flex';
}

// Hide the loading spinner
function hideLoadingSpinner() {
    const loadingSpinner = document.getElementById('loadingSpinner');
    loadingSpinner.style.display = 'none';
}

function getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

// Fetch cart details from Cloud Function
async function fetchCartDetailsFromCloudFunction(cart) {
    const params = new URLSearchParams();

    if (cart) params.append("cart", cart);

    const response = await fetch(`${cloudFunctionURL}?${params.toString()}`);
    if (!response.ok) {
        console.error("Failed to fetch products:", response.statusText);
        return [];
    }

    return await response.json();
}

fetchCartDetailsFromCloudFunction(null);

// Event listeners and UI interactions
function setupCartEventListeners() {
    document.querySelectorAll('.qtyinput').forEach(input => {
        input.addEventListener('blur', async (event) => {
            const productId = event.target.closest('.winkemanditem').getAttribute('data-product-id');
            const newQuantity = parseInt(event.target.value);

            if (!isNaN(newQuantity) && newQuantity > 0) {
                await updateCartQuantity(productId, newQuantity);
            } else {
                event.target.value = ''; // Reset invalid input
            }

            displayCartItems();
        });
    });

    document.querySelectorAll('.deleteicon').forEach(icon => {
        icon.addEventListener('click', (event) => {
            const productId = event.target.closest('.winkemanditem').getAttribute('data-product-id');
            removeFromCart(productId);
        });
    });
}

// Update cart quantity in localStorage
async function updateCartQuantity(productId, newQuantity) {
    const cart = JSON.parse(localStorage.getItem('cart')) || {};

    if (newQuantity > 0) {
        cart[productId] = newQuantity;
    } else {
        delete cart[productId];
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    displayCartItems();
}

// Remove an item from the cart
function removeFromCart(productId) {
    const cart = JSON.parse(localStorage.getItem('cart')) || {};
    delete cart[productId];
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCartItems();
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    displayCartItems();
});

// Function to handle the order button click
async function handleOrderButtonClick() {
    const tokencookie = getCookie('token');
    document.cookie = "winkelmand=true; max-age=3600";
    if (!tokencookie) {
        
        // Show the login popup
        document.getElementById('popupgologin').style.opacity = 1;
        document.getElementById('popupgologin').style.visibility = "visible";
    } else {
        console.log("User is logged in, proceed with order");
        if (urlPath.includes('/nl/')) {
            window.location.href = `/nl/checkout`;
        } else if (urlPath.includes('/en/')) {
            window.location.href = `/en/checkout`;
        } else {
            window.location.href = `/checkout`;
        }
    }
}

// Add event listener for the order button
document.querySelector('[willorder]').addEventListener('click', handleOrderButtonClick);

// Close popup functionality
document.getElementById('closepopupgologin').addEventListener('click', () => {
    document.getElementById('popupgologin').style.opacity = 0;
    document.getElementById('popupgologin').style.visibility = "hidden";
});





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

// Fetch cart details from Cloud Function
async function fetchCartDetailsFromCloudFunction(cart) {
    try {

        // Prepare payload
        const payload = {
            cart
        };

        // Fetch cart details
        const response = await fetch(cloudFunctionURL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`Error fetching cart details: ${response.statusText}`);
        }

        const data = await response.json();

        if (!data.success) {
            console.error("Cloud Function returned an error:", data.error);
        }

        return data;
    } catch (error) {
        console.error("Failed to fetch cart details:", error);
        return { success: false, error: error.message };
    }
}

// Display cart items
async function displayCartItems() {
    const cart = JSON.parse(localStorage.getItem('cart')) || {};
    const selectedProductsEl = document.getElementById('selectedproducts');
    selectedProductsEl.innerHTML = ''; // Clear previous items

    try {
        showLoadingSpinner();

        // Fetch cart details
        const cartDetails = await fetchCartDetailsFromCloudFunction(cart);

        if (cartDetails.success) {
            const { products, totalPrice } = cartDetails;

            for (const product of products) {
                // Generate product HTML dynamically
                const productHTML = `
                    <div class="holderdeliveryinfo winkemanditem" data-product-id="${product.productId}">
                        <div class="winkelmanditem">
                            <img src="${product.afbeeldingURL}" loading="lazy" class="productcartimage">
                            <div class="winkelmanditeminfo">
                                <div class="bold-text">${product.naam}</div>
                                <div class="spacer10px"></div>
                                <div class="alwaysflexhorizontal">
                                    <input class="w-input qtyinput" type="number" value="${product.quantity}" min="1">
                                    <img class="deleteicon" src="/images/deleteicon.svg" loading="lazy">
                                </div>
                            </div>
                            <div class="winkelmanditempriceholder">
                                <div class="price">${product.totalProductPrice.toFixed(2)}€</div>
                            </div>
                        </div>
                    </div>
                `;

                selectedProductsEl.insertAdjacentHTML('beforeend', productHTML);
            }

            // Display the total price
            document.getElementById('totalprice').textContent = `${totalPrice.toFixed(2)} €`;

            // Set up event listeners
            setupCartEventListeners();
        } else {
            console.error("Failed to load cart items:", cartDetails.error || cartDetails.message);
        }
    } catch (error) {
        console.error("Error displaying cart items:", error);
    } finally {
        hideLoadingSpinner();
    }
}

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





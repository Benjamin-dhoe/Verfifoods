// Import Firebase modules
import { auth, app } from '/js/firebase.js';
import { getFirestore, doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js';
import { onAuthStateChanged, browserLocalPersistence } from 'https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js';

const db = getFirestore(app);

// Function to show the loading spinner
function showLoadingSpinner() {
    const loadingSpinner = document.getElementById('loadingSpinner');
    loadingSpinner.style.display = 'flex';
}

// Function to hide the loading spinner
function hideLoadingSpinner() {
    const loadingSpinner = document.getElementById('loadingSpinner');
    loadingSpinner.style.display = 'none';
}

const urlPath = window.location.pathname;

function getProductName(productData) {
    
    if (urlPath.includes('/nl/')) {
        return productData.naamNL;
    } else if (urlPath.includes('/en/')) {
        return productData.naamEN; // Ensure you have naamEN in your Firestore
    } else {
        return productData.naamFR; // Default to naamFR
    }
}

// Function to retrieve product details from Firestore
async function getProductFromFirestore(productId) {
    try {
        showLoadingSpinner(); // Show spinner when fetching data
        const productDoc = await getDoc(doc(db, 'Producten', productId));
        hideLoadingSpinner(); // Hide spinner after fetching data
        
        if (productDoc.exists()) {
            const productData = productDoc.data();
            if (productData.verwijderd) {
                console.error(`Product with ID ${productId} is marked as removed.`);
                return null;
            }
            return {
                naam: getProductName(productData), // Use the function to get the correct name
                prijs: productData.prijs,
                afbeeldingURL: productData.afbeeldingURL
            };
        } else {
            console.error(`No product found with ID: ${productId}`);
            return null;
        }
    } catch (error) {
        hideLoadingSpinner(); // Hide spinner in case of error
        console.error(`Error fetching product with ID ${productId}:`, error);
        return null;
    }
}

// Function to display the cart items
async function displayCartItems() {
    const cart = JSON.parse(localStorage.getItem('cart')) || {};
    const selectedProductsEl = document.getElementById('selectedproducts');
    selectedProductsEl.innerHTML = ''; // Clear previous items
    let totalPrice = 0;

    for (let productId of Object.keys(cart)) {
        const quantity = cart[productId];
        
        // Retrieve product information from Firestore
        const productInfo = await getProductFromFirestore(productId);
        if (!productInfo) {
            console.error(`Product with ID ${productId} not found or removed.`);
            continue;
        }

        const productPrice = productInfo.prijs * quantity;
        totalPrice += productPrice;

        // Create the HTML structure dynamically for each product
        const productHTML = `
            <div class="holderdeliveryinfo winkemanditem" data-product-id="${productId}">
                <div class="winkelmanditem">
                    <img src="${productInfo.afbeeldingURL}" loading="lazy" class="productcartimage">
                    <div class="winkelmanditeminfo">
                        <div class="bold-text">${productInfo.naam}</div>
                        <div class="spacer10px"></div>
                        <div class="alwaysflexhorizontal">
                            <input class="w-input qtyinput" type="number" value="${quantity}" min="1">
                            <img class="deleteicon" src="/images/deleteicon.svg" loading="lazy">
                        </div>
                    </div>
                    <div class="winkelmanditempriceholder">
                        <div class="price">${productPrice.toFixed(2)}€</div>
                    </div>
                </div>
            </div>
        `;
        
        selectedProductsEl.insertAdjacentHTML('beforeend', productHTML);
    }

    // Display the total price
    document.getElementById('totalprice').textContent = `${totalPrice.toFixed(2)} €`;

    // Add event listeners for quantity changes and deleting items
    setupCartEventListeners();
}

// Function to set up event listeners for quantity changes and delete buttons
function setupCartEventListeners() {
    // Quantity change event listener using blur
    document.querySelectorAll('.qtyinput').forEach(input => {
        input.addEventListener('blur', async (event) => {
            const productId = event.target.closest('.winkemanditem').getAttribute('data-product-id');
            const newQuantity = parseInt(event.target.value);

            if (!isNaN(newQuantity) && newQuantity > 0) {
                // Update the cart in localStorage if valid
                await updateCartQuantity(productId, newQuantity);
            } else {
                // Clear the input field for user to re-enter a value
                event.target.value = ''; 
            }

            // Recalculate the total price
            recalculateTotalPrice();
        });
    });

    // Delete button event listener
    document.querySelectorAll('.deleteicon').forEach(icon => {
        icon.addEventListener('click', (event) => {
            const productId = event.target.closest('.winkemanditem').getAttribute('data-product-id');
            removeFromCart(productId); // Remove item from cart
        });
    });
}

// Function to update the cart quantity in localStorage
async function updateCartQuantity(productId, newQuantity) {
    const cart = JSON.parse(localStorage.getItem('cart')) || {};
    
    if (newQuantity > 0) {
        cart[productId] = newQuantity;
    } else {
        delete cart[productId]; // Remove item if quantity is zero or less
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    displayCartItems(); // Update the UI
}

// Function to remove an item from the cart
function removeFromCart(productId) {
    const cart = JSON.parse(localStorage.getItem('cart')) || {};
    delete cart[productId]; // Remove the item from the cart
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCartItems(); // Update the UI
}

// Function to recalculate the total price
async function recalculateTotalPrice() {
    const cart = JSON.parse(localStorage.getItem('cart')) || {};
    let totalPrice = 0;

    const pricePromises = Object.keys(cart).map(async (productId) => {
        const productInfo = await getProductFromFirestore(productId);
        if (productInfo) {
            totalPrice += productInfo.prijs * cart[productId];
        }
    });

    await Promise.all(pricePromises);
    document.getElementById('totalprice').textContent = `${totalPrice.toFixed(2)} €`;
}

// Document Ready
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
    if (!tokencookie) {
        // Set the cookie
        document.cookie = "winkelmand=true; max-age=3600"; // expires in 1 hour
        
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





// Import Firebase modules
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js';
import { getFirestore, doc, getDoc } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js';

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCIQlfqz-Hd-Oe0tNjnEfJdwHwMyJuNr4",
    authDomain: "test-9efbe.firebaseapp.com",
    projectId: "test-9efbe",
    storageBucket: "test-9efbe.appspot.com",
    messagingSenderId: "218327249026",
    appId: "1:218327249026:web:0d48fa588ac45ef557049b",
    measurementId: "G-2ZTZCL27TE"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Function to retrieve product details from Firestore
async function getProductFromFirestore(productId) {
    try {
        const productDoc = await getDoc(doc(db, 'Producten', productId));
        if (productDoc.exists()) {
            const productData = productDoc.data();
            if (productData.verwijderd) {
                console.error(`Product with ID ${productId} is marked as removed.`);
                return null;
            }
            return {
                naamNL: productData.naamNL,
                prijs: productData.prijs,
                afbeeldingURL: productData.afbeeldingURL
            };
        } else {
            console.error(`No product found with ID: ${productId}`);
            return null;
        }
    } catch (error) {
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
                        <div class="bold-text">${productInfo.naamNL}</div>
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

document.addEventListener('DOMContentLoaded', () => {
    displayCartItems();
});




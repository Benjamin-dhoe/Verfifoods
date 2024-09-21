// Import Firebase modules
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js';
import { getFirestore, doc, getDoc } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js';

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCIQlfqz-Hd-Oe0tNjnEfJdwHwMy3JuNr4",
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
                            <div class="deletebtn w-embed">
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="14" viewbox="0 0 12 14">
                                    <g id="_1814090_delete_garbage_trash_icon_1_" data-name="1814090_delete_garbage_trash_icon (1)" transform="translate(-12.5 -8)">
                                        <g id="Icon-Trash" transform="translate(12.5 8)">
                                            <path id="Fill-6" d="M-207.5-205.1h1.471v11.77H-207.5Z" transform="translate(213.385 212.407)" fill="currentColor"></path>
                                            <path id="Fill-7" d="M-201.5-205.1h1.471v11.77H-201.5Z" transform="translate(210.327 212.407)" fill="currentColor"></path>
                                            <path id="Fill-8" d="M-195.5-205.1h1.471v11.77H-195.5Z" transform="translate(207.27 212.407)" fill="currentColor"></path>
                                            <path id="Fill-9" d="M-219.5-214.1h19.126v1.471H-219.5Z" transform="translate(219.5 216.994)" fill="currentColor"></path>
                                            <path id="Fill-10" d="M-200.142-216.371h-1.373v-1.471a.775.775,0,0,0-.785-.785h-2.942a.775.775,0,0,0-.785.785v1.471H-207.4v-1.471A2.177,2.177,0,0,1-205.242-220h2.942a2.177,2.177,0,0,1,2.158,2.158v1.471" transform="translate(213.334 220)" fill="currentColor"></path>
                                            <path id="Fill-11" d="M-203.995-192.789h-8.827a2.381,2.381,0,0,1-2.3-2.158L-216.5-212.6l1.471-.1,1.373,17.655a.889.889,0,0,0,.834.785h8.827a.852.852,0,0,0,.834-.785l1.373-17.655,1.471.1-1.373,17.655a2.342,2.342,0,0,1-2.3,2.158" transform="translate(217.971 216.28)" fill="currentColor"></path>
                                        </g>
                                    </g>
                                </svg>
                            </div>
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
    // Quantity change event listener
    document.querySelectorAll('.qtyinput').forEach(input => {
        input.addEventListener('input', (event) => {
            const productId = event.target.closest('.winkemanditem').getAttribute('data-product-id');
            const newQuantity = parseInt(event.target.value);

            // Update the cart in localStorage
            updateCartQuantity(productId, newQuantity);
            // Recalculate the total price
            recalculateTotalPrice();
        });
    });

    // Delete button event listener
    document.querySelectorAll('.deletebtn').forEach(button => {
        button.addEventListener('click', (event) => {
            const productId = event.target.closest('.winkemanditem').getAttribute('data-product-id');

            // Remove item from cart
            removeFromCart(productId);
            // Recalculate the total price
            recalculateTotalPrice();
        });
    });
}

// Function to update the cart quantity in localStorage
function updateCartQuantity(productId, newQuantity) {
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
function recalculateTotalPrice() {
    const cart = JSON.parse(localStorage.getItem('cart')) || {};
    let totalPrice = 0;

    Object.keys(cart).forEach(async (productId) => {
        const productInfo = await getProductFromFirestore(productId);
        if (productInfo) {
            totalPrice += productInfo.prijs * cart[productId];
        }
    });

    document.getElementById('totalprice').textContent = `${totalPrice.toFixed(2)} €`;
}

document.addEventListener('DOMContentLoaded', () => {
    displayCartItems();
});

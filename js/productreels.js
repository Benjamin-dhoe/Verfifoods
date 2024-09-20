import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js';
import { getFirestore, collection, getDocs, query, where } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js';

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

// Function to get language from URL
function getLanguageFromURL() {
    const url = window.location.href;
    if (url.includes('/nl')) {
        return 'nl';
    } else if (url.includes('/en')) {
        return 'en';
    } else {
        return 'fr';
    }
}

// Fetch products from Firebase with an optional type filter
async function fetchProducts(type = null) {
    let productsQuery = collection(db, 'Producten');

    // If a type is specified, filter products by type
    if (type) {
        productsQuery = query(productsQuery, where('type', '==', type));
    }

    const productsSnapshot = await getDocs(productsQuery);
    return productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Shuffle an array
function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
}

// Update products in elements
async function updateProducts() {
    const elements = document.querySelectorAll('[showproducts]');
    const lang = getLanguageFromURL(); // Get language from URL
    
    elements.forEach(async (element) => {
        const count = parseInt(element.getAttribute('showproducts'), 10);
        const type = element.getAttribute('type'); // Get the 'type' attribute, if any
        
        // Fetch products based on the type filter
        const products = await fetchProducts(type);

        // Clear existing content with fade-out
        element.style.opacity = '0';
        setTimeout(() => {
            element.innerHTML = '';

            // Shuffle products and select the desired count
            const shuffledProducts = shuffleArray(products).slice(0, count);
            
            // Create product elements
            shuffledProducts.forEach(product => {
                const productElement = document.createElement('a');
                productElement.className = 'holderthumbnailproduct';

                // Construct the product URL with the language prefix
                let productURL;
                if (lang === 'nl') {
                    productURL = `/nl/product/${product.id}`;
                } else if (lang === 'en') {
                    productURL = `/en/product/${product.id}`;
                } else {
                    productURL = `/fr/product/${product.id}`;
                }

                productElement.href = productURL;

                // Choose the name field based on the detected language
                let productName;
                if (lang === 'nl') {
                    productName = product.naamNL;
                } else if (lang === 'en') {
                    productName = product.naamEN;
                } else {
                    productName = product.naamFR;
                }

                // Construct the product element HTML
                productElement.innerHTML = `
                    <div class="shoppingcartbtn">
                        <img src="/images/8726224_shopping_cart_icon.svg" loading="lazy" alt="">
                    </div>
                    <img src="${product.afbeeldingURL}" loading="lazy" alt="" class="thumbproductimage">
                    <div class="thumbproductoverlay showcase">
                        <div class="mediumbold-text">${productName}</div>
                        <div class="brown-text bold-text">${product.prijs}€</div>
                    </div>
                `;
                
                // Append the product directly to the showproducts element
                element.appendChild(productElement);
            });

            // Fade in the new content
            element.style.opacity = '1';
        }, 300); // Match this delay to the CSS transition duration
    });
}

// Initial update
updateProducts();

// Update every 10 seconds
setInterval(updateProducts, 10000);

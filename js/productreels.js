// Import Firebase modules
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js';
import { getFirestore, collection, getDocs } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js';

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCIQlfqz-Hd-Oe0tNjnEfJdwHwMy3JuNr4",
    authDomain: "test-9efbe.firebaseapp.com",
    projectId: "test-9efbe",
    storageBucket: "test-9efbe.appspot.com",
    messagingSenderId: "218327249026",
    appId: "1:218327249026:web:0d48fa588ac45ef557049b",
    measurementId: "G-2ZTZCL27TE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Fetch products from Firebase
async function fetchProducts() {
    const productsSnapshot = await getDocs(collection(db, 'Producten'));
    return productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Shuffle an array
function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
}

// Update products in elements
async function updateProducts() {
    const products = await fetchProducts();
    const elements = document.querySelectorAll('[showproducts]');
    
    elements.forEach(element => {
        const count = parseInt(element.getAttribute('showproducts'), 10);
        
        // Clear existing content with fade-out
        element.style.opacity = '0';
        setTimeout(() => {
            element.innerHTML = '';

            // Shuffle products and select the desired count
            const shuffledProducts = shuffleArray(products).slice(0, count);
            
            // Create product elements
            shuffledProducts.forEach(product => {
                const productElement = document.createElement('div');
                productElement.className = 'holderthumbnailproduct';
                
                productElement.innerHTML = `
                    <div class="shoppingcartbtn">
                        <img src="/images/8726224_shopping_cart_icon.svg" loading="lazy" alt="">
                    </div>
                    <img src="${product.afbeeldingURL}" loading="lazy" alt="" class="thumbproductimage">
                    <div class="thumbproductoverlay showcase">
                        <div class="mediumbold-text">${product.naamNL}</div>
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


import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js';
import { getFirestore, collection, getDocs } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js';

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

// Update products in elements
async function updateProducts() {
    const products = await fetchProducts();
    const elements = document.querySelectorAll('[showproducts]');
    
    elements.forEach(element => {
        const count = parseInt(element.getAttribute('showproducts'), 10);
        const container = document.createElement('div');
        container.className = 'product-container';
        
        // Create product elements
        products.slice(0, count).forEach(product => {
            const productElement = document.createElement('a');
            productElement.className = 'holderthumbnailproduct';
            productElement.href = `/product/${product.id}`;
            
            productElement.innerHTML = `
                <div class="shoppingcartbtn">
                    <img src="/images/8726224_shopping_cart_icon.svg" loading="lazy" alt="">
                </div>
                <div class="mediumbold-text">${product.naamNL}</div>
                <div class="brown-text bold-text">${product.prijs}€</div>
            `;
            
            container.appendChild(productElement);
        });
        
        element.innerHTML = ''; // Clear existing content
        element.appendChild(container);
    });
}

// Initial update
updateProducts();

// Update every 10 seconds
setInterval(updateProducts, 10000);

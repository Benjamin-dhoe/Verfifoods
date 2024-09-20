import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js';
import { getFirestore, collection, getDocs, query, where, limit } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js';

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

let cachedProducts = {};  // Store fetched products by type
let currentIndex = {};  // Track current index for each type

// Get language from URL
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

// Fetch products once based on type, with a maximum limit of 18
async function fetchProducts(type = null) {
    let productsQuery = collection(db, 'Producten');

    if (type) {
        productsQuery = query(productsQuery, where('type', '==', type), limit(18)); // Filter by type with a max of 18
    } else {
        productsQuery = query(productsQuery, limit(18)); // Limit to 18 items
    }

    const productsSnapshot = await getDocs(productsQuery);
    return productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Function to update the products on the page
function updateProductsOnPage(products, element, count, lang) {
    let index = currentIndex[element.getAttribute('type')] || 0; // Get the current index for the given type or start at 0

    element.style.opacity = '0';
    setTimeout(() => {
        element.innerHTML = '';  // Clear previous content

        // Slice out the correct amount of products, wrapping around if needed
        const selectedProducts = [];
        for (let i = 0; i < count; i++) {
            selectedProducts.push(products[(index + i) % products.length]);
        }

        // Update current index for next rotation
        currentIndex[element.getAttribute('type')] = (index + count) % products.length;

        // Create product elements and append them to the container
        selectedProducts.forEach(product => {
            const productElement = document.createElement('a');
            productElement.className = 'holderthumbnailproduct';

            let productURL;
            if (lang === 'nl') {
                productURL = `/nl/product/${product.id}`;
            } else if (lang === 'en') {
                productURL = `/en/product/${product.id}`;
            } else {
                productURL = `/product/${product.id}`;
            }

            let productName;
            if (lang === 'nl') {
                productName = product.naamNL;
            } else if (lang === 'en') {
                productName = product.naamEN;
            } else {
                productName = product.naamFR;
            }

            productElement.href = productURL;
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
            element.appendChild(productElement);
        });

        element.style.opacity = '1';
    }, 300);  // Match this delay to your CSS transition
}

// Fetch and display partner reel
async function updatePartnerReel() {
    const partnerReelElement = document.querySelector('[partnerreel]');
    if (!partnerReelElement) return; // If no partnerreel element exists, exit

    const lang = getLanguageFromURL();
    const partnersSnapshot = await getDocs(collection(db, 'Leveranciers'));  // Fetch all suppliers from the 'Leveranciers' collection

    partnersSnapshot.docs.forEach(doc => {
        const partner = doc.data();

        const partnerElement = document.createElement('a');
        partnerElement.className = 'partner w-inline-block';

        let partnerURL;
        if (lang === 'nl') {
            partnerURL = `/nl/leverancier/${doc.id}`;
        } else if (lang === 'en') {
            partnerURL = `/en/supplier/${doc.id}`;
        } else {
            partnerURL = `/fournisseur/${doc.id}`;
        }

        partnerElement.href = partnerURL;

        partnerElement.innerHTML = `
            <img width="207" loading="eager" alt="" src="${partner.Logo}" class="logo-partner">
        `;

        partnerReelElement.appendChild(partnerElement);
    });
}

// Initial product fetch and rotation setup
async function updateProducts() {
    const elements = document.querySelectorAll('[showproducts]');
    const lang = getLanguageFromURL();

    elements.forEach(async (element) => {
        const count = parseInt(element.getAttribute('showproducts'), 10);
        const type = element.getAttribute('type');  // Get the 'type' attribute, if any

        // Check if products for the specific type are already cached
        if (!cachedProducts[type]) {
            cachedProducts[type] = await fetchProducts(type);  // Fetch and cache the products if not cached
        }

        const products = cachedProducts[type];
        
        // Update products in the element
        if (products.length > 0) {
            updateProductsOnPage(products, element, count, lang);
        }
    });
}

// Initial update
updateProducts();
updatePartnerReel();  // Fetch and update partner reel on page load

// Update products every 10 seconds, rotating through cached products
setInterval(updateProducts, 10000);



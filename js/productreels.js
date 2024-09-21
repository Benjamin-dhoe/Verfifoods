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

let cachedProducts = {};  // Store fetched products by type or supplier
let currentIndex = {};    // Track current index for each type or supplier

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

// Fetch products once based on type or supplier, with a maximum limit of 18
async function fetchProducts(type = null, supplier = null) {
    let productsQuery = collection(db, 'Producten');

    // If supplier is set, filter by supplier (leverancier)
    if (supplier) {
        productsQuery = query(productsQuery, where('leverancier', '==', supplier), limit(18));
    }
    // Otherwise, if type is set, filter by type
    else if (type) {
        productsQuery = query(productsQuery, where('type', '==', type), limit(18));
    } 
    // If neither type nor supplier is set, fetch all products with a limit of 18
    else {
        productsQuery = query(productsQuery, limit(18));
    }

    const productsSnapshot = await getDocs(productsQuery);
    return productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Function to update the products on the page
function updateProductsOnPage(products, element, count, lang) {
    let cacheKey = element.getAttribute('type') || element.getAttribute('supplier'); 
    let index = currentIndex[cacheKey] || 0; // Get the current index for the given type or supplier, or start at 0

    element.style.opacity = '0';
    setTimeout(() => {
        element.innerHTML = '';  // Clear previous content

        // Slice out the correct amount of products, wrapping around if needed
        const selectedProducts = [];
        for (let i = 0; i < count; i++) {
            selectedProducts.push(products[(index + i) % products.length]);
        }

        // Update current index for next rotation
        currentIndex[cacheKey] = (index + count) % products.length;

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

// Initial product fetch and rotation setup
async function updateProducts() {
    const elements = document.querySelectorAll('[showproducts]');
    const lang = getLanguageFromURL();

    elements.forEach(async (element) => {
        const count = parseInt(element.getAttribute('showproducts'), 10);
        const type = element.getAttribute('type');       // Get the 'type' attribute, if any
        const supplier = element.getAttribute('supplier'); // Get the 'supplier' attribute, if any

        // Determine cache key based on supplier or type
        const cacheKey = supplier || type || 'all'; 

        // Check if products for the specific type or supplier are already cached
        if (!cachedProducts[cacheKey]) {
            cachedProducts[cacheKey] = await fetchProducts(type, supplier);  // Fetch and cache the products
        }

        const products = cachedProducts[cacheKey];
        
        // Update products in the element
        if (products.length > 0) {
            updateProductsOnPage(products, element, count, lang);
        }
    });
}

async function updatePartnerReel() {
    const partnerReelElement = document.querySelector('[partnerreel]');
    if (!partnerReelElement) return; // If no partnerreel element exists, exit

    const lang = getLanguageFromURL();
    const partnersSnapshot = await getDocs(collection(db, 'Leveranciers'));  // Fetch all suppliers from the 'Leveranciers' collection

    const partnerElements = [];

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

        partnerElements.push(partnerElement);
    });

    // Append original partners
    partnerElements.forEach(element => partnerReelElement.appendChild(element));

    // Append cloned partners for seamless scrolling
    partnerElements.forEach(element => {
        const clone = element.cloneNode(true);
        partnerReelElement.appendChild(clone);
    });

    // Dynamically adjust the scroll animation duration based on the number of partners
    adjustScrollSpeed(partnerElements.length);
}

// Function to adjust the animation duration dynamically
function adjustScrollSpeed(partnerCount) {
    const partnerWidth = 207; // Assuming each partner is 207px wide (same as your image width)
    const totalWidth = partnerCount * partnerWidth * 2; // Multiply by 2 to include cloned elements

    // Set animation duration based on total width (larger width = longer scroll time)
    const scrollDuration = totalWidth / 50; // Adjust this factor to control speed (smaller = faster)

    // Apply inline style to #partners element
    const partnerReelElement = document.getElementById('partners');
    partnerReelElement.style.animationDuration = `${scrollDuration}s`;
}

// Initial update
updateProducts();
updatePartnerReel();  // Fetch and update partner reel on page load

// Update products every 10 seconds, rotating through cached products
setInterval(updateProducts, 10000);




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

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

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

async function fetchProducts() {
    const productsSnapshot = await getDocs(collection(db, 'Producten'));
    return productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
}

async function updateProducts() {
    const products = await fetchProducts();
    const elements = document.querySelectorAll('[showproducts]');
    const lang = getLanguageFromURL();
    
    elements.forEach(element => {
        const count = parseInt(element.getAttribute('showproducts'), 10);
        
        element.style.opacity = '0';
        setTimeout(() => {
            element.innerHTML = '';

            const shuffledProducts = shuffleArray(products).slice(0, count);
            
            shuffledProducts.forEach(product => {
                const productElement = document.createElement('a');
                productElement.className = 'holderthumbnailproduct';

                let productURL;
                if (lang === 'nl') {
                    productURL = `/nl/product/${product.id}`;
                } else if (lang === 'en') {
                    productURL = `/en/product/${product.id}`;
                } else {
                    productURL = `/fr/product/${product.id}`;
                }

                productElement.href = productURL;

                let productName;
                if (lang === 'nl') {
                    productName = product.naamNL;
                } else if (lang === 'en') {
                    productName = product.naamEN;
                } else {
                    productName = product.naamFR;
                }

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
        }, 300);
}

updateProducts();

setInterval(updateProducts, 10000);

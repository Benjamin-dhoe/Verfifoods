import { app } from '/js/firebase.js';
import { getFirestore, doc, getDoc, getDocs, collection } from 'https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js';

const db = getFirestore(app);

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

// Function to create and add the popup to the body
function createPopup() {
    const popupHTML = `
        <div id="product-van-de-week" class="popupholder" style="opacity: 1">
            <div class="popupcontainer vis">
                <div class="closebtn" id="close-product-van-de-week">X</div>
                <div id="content-product-week">
                    <div class="brownundertitle" style="text-align: center">Product van de week</div>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', popupHTML);
}

// Fetch product details from our Cloud Function
async function fetchProductById(productId) {
    try {
        const response = await fetch("https://europe-west1-test-9efbe.cloudfunctions.net/getProduct", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId: productId })
        });

        if (!response.ok) {
            throw new Error("Failed to fetch product details");
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching product:", error);
        return null;
    }
}

document.addEventListener("DOMContentLoaded", async function () {
    createPopup(); // Add popup to the body

    const popupHolder = document.getElementById("product-van-de-week");
    const closeBtn = document.getElementById("close-product-van-de-week");
    const contentContainer = document.getElementById("content-product-week");

    // Get last seen product ID from localStorage
    const lastSeenProductId = localStorage.getItem("lastSeenProductId");

    try {
        // Fetch the current product ID from Firebase
        const docRef = doc(db, "Other", "product-vd-week");
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) return;

        const currentProductId = docSnap.data().currentProductId;
        if (!currentProductId) return;

        // If the product hasn't changed and was seen, do nothing
        if (lastSeenProductId === currentProductId) return;

        // Fetch product details using our Cloud Function
        const product = await fetchProductById(currentProductId);
        if (!product) return;

        // Detect language
        const lang = getLanguageFromURL();
        let productURL, productName, productBeschrijving;

        if (lang === "nl") {
            productURL = `/nl/product/${product.slugNL}`;
            productName = product.naamNL;
            productBeschrijving = product.beschrijvingNL;
        } else if (lang === "en") {
            productURL = `/en/product/${product.slugEN}`;
            productName = product.naamEN;
            productBeschrijving = product.beschrijvingEN;
        } else {
            productURL = `/product/${product.slugFR}`;
            productName = product.naamFR;
            productBeschrijving = product.beschrijvingFR;
        }

        // Create product HTML inside the popup
        const productElement = document.createElement("a");
        productElement.className = "holderthumbnailproduct";
        productElement.href = productURL;
        productElement.innerHTML = `
            <div class="thumbproductshowcases">
                <img src="${product.afbeeldingURL}" loading="lazy" alt="" class="thumbproductimage">
                <div class="bold-text">${productName}</div>
            </div>
        `;

        contentContainer.appendChild(productElement);

        // Show popup
        popupHolder.style.visibility = "visible";

        // Close button functionality
        closeBtn.addEventListener("click", function () {
            popupHolder.style.visibility = "hidden";
            localStorage.setItem("lastSeenProductId", currentProductId);
        });

    } catch (error) {
        console.error("Error fetching product of the week:", error);
    }
});

const cloudFunctionURL = "https://europe-west1-test-9efbe.cloudfunctions.net/getRandomProducts";

let cachedProducts = {};
let currentIndex = {};

async function fetchProductsFromCloudFunction(type = null, supplier = null) {
    const params = new URLSearchParams();

    if (type) params.append("type", type);
    if (supplier) params.append("supplier", supplier);
    params.append("limit", 18);

    const response = await fetch(`${cloudFunctionURL}?${params.toString()}`);
    if (!response.ok) {
        console.error("Failed to fetch products:", response.statusText);
        return [];
    }

    return await response.json();
}

function updateProductsOnPage(products, element, count, lang) {
    let cacheKey = element.getAttribute('type') || element.getAttribute('supplier'); 
    let index = currentIndex[cacheKey] || 0;

    element.style.opacity = '0';
    setTimeout(() => {
        element.innerHTML = '';  // Clear previous content

        const selectedProducts = [];
        for (let i = 0; i < count; i++) {
            selectedProducts.push(products[(index + i) % products.length]);
        }

        currentIndex[cacheKey] = (index + count) % products.length;

        selectedProducts.forEach(product => {
            const productElement = document.createElement('a');
            productElement.className = 'holderthumbnailproduct';

            let productURL;
            let productName;
            let productBeschrijving;
            if (lang === 'nl') {
                productURL = `/nl/product/${product.slugNL}`;
                productName = product.naamNL;
                productBeschrijving = product.beschrijvingNL;
            } else if (lang === 'en') {
                productURL = `/en/product/${product.slugEN}`;
                productName = product.naamEN;
                productBeschrijving = product.beschrijvingEN;
            } else {
                productURL = `/product/${product.slugFR}`;
                productName = product.naamFR;
                productBeschrijving = product.beschrijvingFR;
            }

            productElement.href = productURL;
            productElement.innerHTML = `
                <div class="shoppingcartbtn">
                    <img src="/images/8726224_shopping_cart_icon.svg" loading="lazy" alt="">
                </div>
                <div class="thumbproductshowcases">
                    <img src="${product.afbeeldingURL}" loading="lazy" alt="" class="thumbproductimage">
                    <div class="bold-text">${productName}</div>
                </div>
            `;
            element.appendChild(productElement);
        });

        element.style.opacity = '1';
    }, 300);
}

async function updateProducts() {
    const elements = document.querySelectorAll('[showproducts]');
    const lang = getLanguageFromURL();

    elements.forEach(async (element) => {
        const count = parseInt(element.getAttribute('showproducts'), 10);
        const type = element.getAttribute('type');
        const supplier = element.getAttribute('supplier');

        const cacheKey = supplier || type || 'all'; 

        if (!cachedProducts[cacheKey]) {
            cachedProducts[cacheKey] = await fetchProductsFromCloudFunction(type, supplier);
        }

        const products = cachedProducts[cacheKey];
        
        if (products.length > 0) {
            updateProductsOnPage(products, element, count, lang);
        }
    });
}

async function updatePartnerReel() {
    const partnerReelElement = document.querySelector('[partnerreel]');
    if (!partnerReelElement) return;

    const lang = getLanguageFromURL();
    const partnersSnapshot = await getDocs(collection(db, 'Leveranciers'));

    const partnerElements = [];

    partnersSnapshot.docs.forEach(doc => {
        const partner = doc.data();

        const partnerElement = document.createElement('a');
        partnerElement.className = 'partner w-inline-block';

        let partnerURL;
        if (lang === 'nl') {
            partnerURL = `/nl/leverancier/${partner.slug}`;
        } else if (lang === 'en') {
            partnerURL = `/en/supplier/${partner.slug}`;
        } else {
            partnerURL = `/fournisseur/${partner.slug}`;
        }

        partnerElement.href = partnerURL;

        partnerElement.innerHTML = `
            <img width="207" loading="eager" alt="" src="${partner.Logo}" class="logo-partner">
        `;

        partnerElements.push(partnerElement);
    });

    partnerElements.forEach(element => partnerReelElement.appendChild(element));

    partnerElements.forEach(element => {
        const clone = element.cloneNode(true);
        partnerReelElement.appendChild(clone);
    });

    adjustScrollSpeed(partnerElements.length);
}

function adjustScrollSpeed(partnerCount) {
    const partnerWidth = 207;
    const totalWidth = partnerCount * partnerWidth * 2;

    const scrollDuration = totalWidth / 200;

    // Apply inline style to #partners element
    const partnerReelElement = document.getElementById('partners');
    partnerReelElement.style.animationDuration = `${scrollDuration}s`;
}

// Initial update
updateProducts();
updatePartnerReel();

setInterval(updateProducts, 10000);




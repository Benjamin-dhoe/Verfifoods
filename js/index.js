import { app } from '/js/firebase.js';
import { getFirestore, doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js';

const db = getFirestore(app);

// Get language from URL
function getLanguageFromURL() {
    const url2 = window.location.href;
    if (url2.includes('/nl')) return 'nl';
    if (url2.includes('/en')) return 'en';
    return 'fr';
}

// Function to create and add the popup to the body
function createPopup() {
    const popupHTML = `
        <div id="product-van-de-week" class="popupholder" style="opacity: 1">
            <div class="popupcontainer vis">
                <div class="closebtn" id="close-product-van-de-week">X</div>
                <div class="leftalignflexvert">
                    <div class="brownundertitle">Product van de week</div>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', popupHTML);
}

document.addEventListener("DOMContentLoaded", async function () {
    createPopup(); // Add popup to the body

    const popupHolder = document.getElementById("product-van-de-week");
    const closeBtn = document.getElementById("close-product-van-de-week");
    const contentContainer = popupHolder.querySelector(".leftalignflexvert");

    // Get last seen product ID from localStorage
    const lastSeenProductId = localStorage.getItem("lastSeenProductId");

    try {
        // Fetch the current product from Firebase
        const docRef = doc(db, "Other", "product-vd-week");
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) return;

        const currentProductId = docSnap.data().currentProductId;
        if (!currentProductId) return;

        // If the product hasn't changed and was seen, do nothing
        if (lastSeenProductId === currentProductId) return;

        // Fetch product details
        const productRef = doc(db, "Products", currentProductId);
        const productSnap = await getDoc(productRef);
        if (!productSnap.exists()) return;

        const product = productSnap.data();

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
            <div class="shoppingcartbtn">
                <img src="/images/8726224_shopping_cart_icon.svg" loading="lazy" alt="">
            </div>
            <div class="thumbproductshowcases">
                <img src="${product.afbeeldingURL}" loading="lazy" alt="" class="thumbproductimage">
                <div class="bold-text">${productName}</div>
                <p>${productBeschrijving}</p>
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

document.addEventListener('DOMContentLoaded', function() {
    // HTML for the language popup
    const popupHtml = `
    <div id="popupLang" class="popupholder">
        <div id="containerLang" class="popupcontainer">
            <div id="closeLang" class="closebtn">X</div>
            <div>
                <div id="langNL" class="langchoice">
                    <img src="/images/Flag-Netherlands.svg" loading="lazy" alt="" class="flag">
                    <div>Nederlands</div>
                </div>
                <div id="langFR" class="langchoice">
                    <img src="/images/Flag-France.svg" loading="lazy" alt="" class="flag">
                    <div>Français</div>
                </div>
                <div id="langEN" class="langchoice">
                    <img src="/images/Flag-Great-Britain.svg" loading="lazy" alt="" class="flag">
                    <div>English</div>
                </div>
            </div>
        </div>
    </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', popupHtml);

    // Language switcher logic
    const url = window.location.href.toLowerCase();
    const langHolderElement = document.querySelector('[langholder]');

    let flagSrc = '/images/Flag-France.svg';
    let langText = 'FR';

    if (url.includes('/nl')) {
        flagSrc = '/images/Flag-Netherlands.svg';
        langText = 'NL';
    } else if (url.includes('/en')) {
        flagSrc = '/images/Flag-Great-Britain.svg';
        langText = 'EN';
    }

    const langHolderHtml = `
    <div id="openLang" class="langholder">
        <img src="${flagSrc}" loading="lazy" alt="" class="flag">
        <div>${langText}</div>
        <div class="rotatedtext">&gt;</div>
    </div>
    `;

    if (langHolderElement) {
        langHolderElement.insertAdjacentHTML('beforeend', langHolderHtml);
    } else {
        document.body.insertAdjacentHTML('beforeend', langHolderHtml);
    }

    const langBtn = document.getElementById('openLang');
    const popupLang = document.getElementById('popupLang');
    const containerLang = document.getElementById('containerLang');
    const closeLang = document.getElementById('closeLang');

    langBtn.addEventListener('click', function() {
        popupLang.style.visibility = "visible";
        popupLang.style.opacity = 1;
        setTimeout(() => {
            containerLang.style.opacity = 1;
        }, 650);
    });

    closeLang.addEventListener('click', function() {
        popupLang.style.opacity = 0;
        popupLang.style.visibility = "hidden";
        containerLang.style.opacity = 0;
    });

    document.getElementById('langNL').addEventListener('click', function() {
        window.location.href = urlNL;
    });

    document.getElementById('langFR').addEventListener('click', function() {
        window.location.href = urlFR;
    });

    document.getElementById('langEN').addEventListener('click', function() {
        window.location.href = urlEN;
    });

    // Navbar toggle
    const toggleBtn = document.getElementById('openNavPhone');
    if (toggleBtn) {
        const navLinksHolder = document.querySelector('.navlinksholder');
        let isOpen = false;
        toggleBtn.addEventListener('click', function() {
            const fullHeight = (window.innerHeight - 80) + 'px';
            if (!isOpen) {
                navLinksHolder.style.height = fullHeight;
            } else {
                navLinksHolder.style.height = '0';
            }
            isOpen = !isOpen;
        });
    }

    // Cookie management functions
    function setCookie(name, value, days) {
        let expires = "";
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/";
    }

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

    function eraseCookie(name) {
        document.cookie = name + '=; Max-Age=-99999999;';
    }

    // Check for authentication via cookies
    const userId = getCookie('userId');

if (userId && document.querySelector('nav')) {
    // Query for the login link in different languages
    const navConnectLink = 
        document.querySelector('nav').querySelector('a[href="/se-connecter"]') || 
        document.querySelector('nav').querySelector('a[href="/nl/login"]') || 
        document.querySelector('nav').querySelector('a[href="/en/login"]') ||
        document.querySelector('nav').querySelector('a[href="/se-connecter.html"]') || 
        document.querySelector('nav').querySelector('a[href="/nl/login.html"]') || 
        document.querySelector('nav').querySelector('a[href="/en/login.html"]');
    
    let languagePrefix = ''; // Default to no prefix (root folder)

    if (navConnectLink) {
        // Remove the login link from the navigation
        navConnectLink.remove();

        const url = window.location.href.toLowerCase();
        const langHolderElement = document.querySelector('[langholder]');
    
        let flagSrc = '/images/Flag-France.svg';
        let langText = 'FR';
    
        if (window.location.href.toLowerCase().includes('/nl')) {
            languagePrefix = '/nl';
        } else if (window.location.href.toLowerCase().includes('/en')) {
            languagePrefix = '/en';
        } else {
            languagePrefix = '';
        }
    }

    // Create the user navigation HTML
    const userNavHtml = `
        <div class="navlink logged w-inline-block">
            <img src="/images/usericon.svg" loading="lazy" alt="" class="loggedicon">
            <div>&gt;</div>
        </div>
    `;
    
    // Insert the new user navigation element
    document.querySelector('.navlinksholder').insertAdjacentHTML('beforeend', userNavHtml);

    // Add an event listener to the new user navigation
    const userNav = document.querySelector('.navlink.logged');
    userNav.addEventListener('click', function() {
        // Redirect to the user page with the appropriate language prefix
        window.location.href = `${languagePrefix}/users/${userId}`;
    });
}
});





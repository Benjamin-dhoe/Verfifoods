const cloudFunctionURL = "https://europe-west1-test-9efbe.cloudfunctions.net/getCart";

function showLoadingSpinner() {
    const loadingSpinner = document.getElementById('loadingSpinner');
    loadingSpinner.style.display = 'flex';
}

function hideLoadingSpinner() {
    const loadingSpinner = document.getElementById('loadingSpinner');
    loadingSpinner.style.display = 'none';
}

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

  async function fetchCartDetailsFromCloudFunction(cart) {
    const checkoutdiv = document.querySelector(".checkoutdivcart");
    try {
        const token = getCookie('token');
        const adminOrder = getCookie('adminOrder');
        const lang = getLanguageFromURL();
        // Prepare payload
        const payload = {
            token,
            cart,
            lang,
            adminOrder
        };

        // Fetch cart details
        const response = await fetch(cloudFunctionURL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error(`Error fetching cart details: ${response.statusText}`);
            alert("Er is iets foutgelopen");
        }

        const data = await response.json();

        if (!data.success) {
            console.error("Cloud Function returned an error:", data.error);
            checkoutdiv.innerHTML = `Error! Contact Verifoods`;
        }

        if (data.status === "redirectadm") {
            window.location.href = data.redirectUrl;
        }

        return data;
    } catch (error) {
        console.error("Failed to fetch cart details:", error);
        return { success: false, error: error.message };
        checkoutdiv.innerHTML = `Error! Contact Verifoods`;
    }
  }

    async function displayCartItems() {
        const cart = JSON.parse(localStorage.getItem('cart')) || {};
        const selectedProductsEl = document.getElementById('selectedproducts');
        let orderText = "";
    
        try {
            showLoadingSpinner();
    
            // Fetch cart details
            
            const cartDetails = await fetchCartDetailsFromCloudFunction(cart);
            selectedProductsEl.innerHTML = '';
            const lang = getLanguageFromURL();
    
            if (cartDetails.success) {
                const { products, totalPrice, status } = cartDetails;

                const updatedCart = {};
                for (const product of products) {
                    updatedCart[product.productId] = product.quantity;
                }
                localStorage.setItem('cart', JSON.stringify(updatedCart));

                if (status === "waiting") {
                    document.getElementById('checkoutdiv').style.display = "none";
                    document.getElementById('offertediv').style.display = "none";
                    document.getElementById('offerteformdiv').style.display = "none";
                    document.getElementById('waitingdiv').style.display = "block";
                    hideLoadingSpinner();
                    return;
                } else if (status === "redirect") {
                    
                     if (lang === 'nl') {
                         window.location.href = "/nl/login";
                    } else if (lang === 'en') {
                         window.location.href = "/en/login";
                    } else {
                         window.location.href = "/se-connecter";
                    }
                }
    
                for (const product of products) {
                    console.log(product);
                    // Generate product HTML dynamically
                    let typeDisclaimer = "";
                    if (lang === 'nl') {
                         if (product.type === "Ijsjes") {
                            typeDisclaimer = `<div class="cartwarning">Opgelet, machine nodig om dit product te maken.</div>`;
                        } else if (product.type === "Smoothies") {
                            typeDisclaimer = `<div class="cartwarning">Blender vereist om product te maken.</div>`;
                        }
                    } else if (lang === 'en') {
                        if (product.type === "Ijsjes") {
                            typeDisclaimer = `<div class="cartwarning">Attention, machine needed for this product.</div>`;
                        } else if (product.type === "Smoothies") {
                            typeDisclaimer = `<div class="cartwarning">Blender needed for this product.</div>`;
                        }
                    } else {
                         if (product.type === "Ijsjes") {
                            typeDisclaimer = `<div class="cartwarning">Attention, machine nécessaire pour ce produit.</div>`;
                        } else if (product.type === "Smoothies") {
                            typeDisclaimer = `<div class="cartwarning">Mélangeur nécessaire pour ce produit.</div>`;
                        }
                    }
                    
                    
                    const productHTML = `
                        <div class="holderdeliveryinfo winkemanditem" data-product-id="${product.productId}">
                            <div class="winkelmanditem">
                                <img src="${product.afbeeldingURL}" loading="lazy" class="productcartimage">
                                <div class="winkelmanditeminfo">
                                    <div class="bold-text">${product.naam}</div>
                                    ${typeDisclaimer}
                                    <div class="spacer10px"></div>
                                    <div class="alwaysflexhorizontal">
                                        <input class="w-input qtyinput" type="number" value="${product.quantity}" min="1">
                                        <img class="deleteicon" src="/images/deleteicon.svg" loading="lazy">
                                    </div>
                                </div>
                                <div class="winkelmanditempriceholder">
                                    <div class="price">${product.totalProductPrice}€</div>
                                </div>
                            </div>
                        </div>
                    `;

                    orderText += `${product.naam} x ${product.quantity} -- `;
    
                    selectedProductsEl.insertAdjacentHTML('beforeend', productHTML);
                }

                document.getElementById("pass-order").value = orderText;

                if (status === "unlogged") {
                    document.getElementById('checkoutdiv').style.display = "none";
                    document.getElementById('offertediv').style.display = "block";
                    document.getElementById('offerteformdiv').style.display = "block";
                    document.getElementById('waitingdiv').style.display = "none";
                } else {
                    document.getElementById('checkoutdiv').style.display = "block";
                    document.getElementById('offertediv').style.display = "none";
                    document.getElementById('offerteformdiv').style.display = "none";
                    document.getElementById('waitingdiv').style.display = "none";
                }
    
                // Display the total price
                document.getElementById('exclprice').textContent = `${totalPrice} €`;
                document.getElementById('vatprice').textContent = `${totalPrice * 0.06} €`;
                document.getElementById('inclprice').textContent = `${totalPrice * 1.06} €`;
    
                // Set up event listeners
                setupCartEventListeners();
            } else {
                console.error("Failed to load cart items:", cartDetails.error || cartDetails.message);
                selectedProductsEl.innerHtml = `
                        <div class="holderdeliveryinfo error">
                            Error! ${cartDetails.message}
                        </div>
                    `
            }
        } catch (error) {
            console.error("Error displaying cart items:", error);
            checkoutdiv.innerHTML = `Error! Contact Verifoods`;
        } finally {
            hideLoadingSpinner();
        }
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

// Fetch cart details from Cloud Function

function setupCartEventListeners() {
    document.querySelectorAll('.qtyinput').forEach(input => {
        input.addEventListener('blur', async (event) => {
            const productId = event.target.closest('.winkemanditem').getAttribute('data-product-id');
            const newQuantity = parseInt(event.target.value);

            if (!isNaN(newQuantity) && newQuantity > 0) {
                await updateCartQuantity(productId, newQuantity);
            } else {
                event.target.value = ''; // Reset invalid input
            }

            displayCartItems();
        });
    });

    document.querySelectorAll('.deleteicon').forEach(icon => {
        icon.addEventListener('click', (event) => {
            const productId = event.target.closest('.winkemanditem').getAttribute('data-product-id');
            removeFromCart(productId);
        });
    });
}

// Update cart quantity in localStorage
async function updateCartQuantity(productId, newQuantity) {
    const cart = JSON.parse(localStorage.getItem('cart')) || {};

    if (newQuantity > 0) {
        cart[productId] = newQuantity;
    } else {
        delete cart[productId];
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    displayCartItems();
}

// Remove an item from the cart
function removeFromCart(productId) {
    const cart = JSON.parse(localStorage.getItem('cart')) || {};
    delete cart[productId];
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCartItems();
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    displayCartItems();
});





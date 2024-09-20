// Function to handle quantity change
document.querySelectorAll('.qtyhandlers').forEach(button => {
    button.addEventListener('click', (event) => {
        const action = event.target.getAttribute('data-action');
        const qtyElement = event.target.closest('.qtycontrols').querySelector('.qtyamount');
        let currentQty = parseInt(qtyElement.textContent);

        // Update quantity based on the button clicked (plus or minus)
        if (action === 'plusitem') {
            qtyElement.textContent = currentQty + 1;
        } else if (action === 'minusitem' && currentQty > 1) {
            qtyElement.textContent = currentQty - 1;
        }
    });
});

// Function to handle adding to cart
document.querySelectorAll('[data-cartbtn]').forEach(button => {
    const productId = button.getAttribute('data-cartbtn');
    const cart = JSON.parse(localStorage.getItem('cart')) || {};

    // Check if the product is already in the cart
    if (cart[productId]) {
        // Create and append the check icon
        const checkIcon = document.createElement('img');
        checkIcon.src = "/images/check.svg";
        checkIcon.loading = "lazy";
        checkIcon.classList.add("checkicon");
        button.insertAdjacentElement('afterend', checkIcon);
    }

    button.addEventListener('click', (event) => {
        const qtyElement = event.target.closest('.holderqtyandaddbtn').querySelector('.qtyamount');
        const quantity = parseInt(qtyElement.textContent);

        if (quantity >= 1) {
            addToCart(productId, quantity);
            // Add the check icon if it wasn't there before
            if (!button.nextElementSibling?.classList.contains("checkicon")) {
                const checkIcon = document.createElement('img');
                checkIcon.src = "/images/check.svg";
                checkIcon.loading = "lazy";
                checkIcon.classList.add("checkicon");
                button.insertAdjacentElement('afterend', checkIcon);
            }
        }
    });
});

// Function to add items to the cart
function addToCart(productId, quantity) {
    let cart = JSON.parse(localStorage.getItem('cart')) || {};

    // Check if product already exists in the cart, then update the quantity
    if (cart[productId]) {
        cart[productId] += quantity;
    } else {
        cart[productId] = quantity;
    }

    // Save the updated cart back to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update shopping cart button
    updateCartButton();

    // Show popup instead of alert
    showPopup();
}

// Function to update the shopping cart button
function updateCartButton() {
    const cart = JSON.parse(localStorage.getItem('cart')) || {};
    const uniqueItemsCount = Object.keys(cart).length;

    // Check if the cart button already exists
    let cartButton = document.querySelector('.shoppingcartbtn');
    if (!cartButton && uniqueItemsCount > 0) {
        // Create and append the cart button
        cartButton = document.createElement('div');
        cartButton.className = "shoppingcartbtn opencart";
        cartButton.innerHTML = `<img src="/images/8726224_shopping_cart_icon.svg" loading="lazy" alt=""><div class="nritems">${uniqueItemsCount}</div>`;
        document.body.appendChild(cartButton);
    } else if (cartButton) {
        // Update the item count
        cartButton.querySelector('.nritems').textContent = uniqueItemsCount;
    }
}

// Function to show the popup
function showPopup() {
    const language = getLanguage();
    const popupText = {
        en: "Item added to cart",
        nl: "Item toegevoegd aan winkelmand",
        fr: "Article ajouté au panier"
    };

    const continueShoppingText = {
        en: "Continue Shopping",
        nl: "Verder winkelen",
        fr: "Continuer vos achats"
    };

    const popupHTML = `
        <div class="popupholder" style="
                display: flex;
                opacity:  100;
                visibility: visible;
            ">
            <div class="popupcontainer vis">
                <div class="closebtn" id="closepopup">X</div>
                <div class="leftalignflexvert">
                    <div>${popupText[language]}</div>
                    <div class="spacer10px"></div>
                    <button class="button intypeholder notabs grey w-button" id="continueShoppingBtn">${continueShoppingText[language]}</button>
                    <div class="spacer10px"></div>
                    <button class="button intypeholder notabs w-button" id="goToCartBtn">Go to Cart</button>
                </div>
            </div>
        </div>
    `;

    // Append popup to body
    document.body.insertAdjacentHTML('beforeend', popupHTML);

    // Add event listener to close button
    document.getElementById('closepopup').addEventListener('click', () => {
        document.querySelector('.popupholder').remove();
    });

    // Add event listener for "Verder winkelen" button
    document.getElementById('continueShoppingBtn').addEventListener('click', () => {
        handleContinueShopping();
    });

    // Add event listener for "Go to Cart" button
    document.getElementById('goToCartBtn').addEventListener('click', () => {
        window.location.href = getCartURL();
    });
}

// Function to get the appropriate language based on the URL
function getLanguage() {
    const currentUrl = window.location.href;
    if (currentUrl.includes('/en/')) {
        return 'en';
    } else if (currentUrl.includes('/nl/')) {
        return 'nl';
    } else {
        return 'fr'; // Default to French
    }
}

// Function to handle "Verder winkelen" button click
function handleContinueShopping() {
    const currentUrl = window.location.href;
    const language = getLanguage();
    
    let redirectUrl = "/";

    if (currentUrl.includes("/product/")) {
        redirectUrl = language === 'en' ? "/en/assortment.html" : language === 'nl' ? "/nl/aanbod.html" : "/gamme.html";
    } else {
        // Determine default behavior based on language
        redirectUrl = language === 'en' ? "/en/assortment.html" : language === 'nl' ? "/nl/aanbod.html" : "/gamme.html";
    }

    window.location.href = redirectUrl;
}

// Function to get the appropriate cart URL based on the language
function getCartURL() {
    const currentUrl = window.location.href;

    if (currentUrl.includes('/en/')) {
        return '/en/cart.html'; // Adjust this to your actual cart URL
    } else if (currentUrl.includes('/nl/')) {
        return '/nl/winkelmand.html'; // Adjust this to your actual cart URL
    } else {
        return '/panier.html'; // Default to French
    }
}

function displayCart() {
    const currentUrl = window.location.href;

    // Determine the appropriate cart URL based on the language
    let cartURL;
    if (currentUrl.includes('/en/')) {
        cartURL = '/en/cart.html'; // Adjust this to your actual cart URL
    } else if (currentUrl.includes('/nl/')) {
        cartURL = '/nl/winkelmand.html'; // Adjust this to your actual cart URL
    } else {
        cartURL = '/panier.html'; // Default to French
    }

    // Redirect to the cart page
    window.location.href = cartURL;
}

// Initial call to update the shopping cart button on page load
updateCartButton();

document.getElementById('goToCartBtn').addEventListener('click', () => {
    displayCart(); // Call the updated function
});







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
    const productName = button.getAttribute('data-cartbtn-name');
    const cart = JSON.parse(localStorage.getItem('cart')) || {};

    // Check if the product is already in the cart
    if (cart[productId]) {
        addCheckIcon(button);
    }

    button.addEventListener('click', (event) => {
        const qtyElement = event.target.closest('.holderqtyandaddbtn').querySelector('.qtyamount');
        const quantity = parseInt(qtyElement.textContent);

        if (quantity >= 1) {
            addToCart(productId, quantity, productName);
            // Add the check icon if it wasn't there before
            if (!button.nextElementSibling?.classList.contains("checkicon")) {
                addCheckIcon(button);
            }
        }
    });
});

// Function to add check icon
function addCheckIcon(button) {
    const checkIcon = document.createElement('img');
    checkIcon.src = "/images/check.svg";
    checkIcon.loading = "lazy";
    checkIcon.classList.add("checkicon");
    button.insertAdjacentElement('afterend', checkIcon);
}

// Function to add items to the cart
function addToCart(productId, quantity, productName) {
    let cart = JSON.parse(localStorage.getItem('cart')) || {};

    // Update the cart with the new quantity
    cart[productId] = (cart[productId] || 0) + quantity;

    // Save the updated cart back to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Update shopping cart button
    updateCartButton();

    // Show popup instead of alert
    showPopup(productName, quantity);
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
        cartButton.innerHTML = `<a class="cart-button"><img src="/images/8726224_shopping_cart_icon.svg" loading="lazy" alt=""><div class="nritems">${uniqueItemsCount}</div></a>`;
        document.body.appendChild(cartButton);

        // Add event listener to redirect to the cart
        cartButton.querySelector('.cart-button').addEventListener('click', displayCart);
    } else if (cartButton) {
        const nritems = cartButton.querySelector('.nritems')
        if (nritems) {
        nritems.textContent = uniqueItemsCount;
        }
    }
}

// Function to show the popup
function showPopup(item, quantity) {
    const language = getLanguage();
    const popupText = {
        en: `${quantity}x ${item} added to cart`,
        nl: `${quantity}x ${item} toegevoegd aan winkelmand`,
        fr: `${quantity}x ${item} ajouté au panier`
    };

    const goToCartText = {
        en: "Go to cart",
        nl: "Naar winkelmandje",
        fr: "Aller au panier"
    };

    const popupHTML = `
        <div class="productedselecteddiv">
            <div class="bold-text">${popupText[language]}</div>
                <button class="button intypeholder" id="goToCartBtn">${goToCartText[language]}</button>
            </div>
    `;

    // Append popup to body
    document.body.insertAdjacentHTML('beforeend', popupHTML);

    // Add event listeners
    document.getElementById('closepopup').addEventListener('click', () => {
        document.querySelector('.popupholder').remove();
    });

    document.getElementById('continueShoppingBtn').addEventListener('click', () => {
        document.querySelector('.popupholder').remove();
    });

    document.getElementById('goToCartBtn').addEventListener('click', displayCart);
}

// Function to get the appropriate language based on the URL
function getLanguage() {
    const currentUrl = window.location.href;
    if (currentUrl.includes('/en/')) return 'en';
    if (currentUrl.includes('/nl/')) return 'nl';
    return 'fr'; // Default to French
}

// Function to get the appropriate cart URL based on the language
function getCartURL() {
    const currentUrl = window.location.href;
    if (currentUrl.includes('/en/')) return '/en/cart.html';
    if (currentUrl.includes('/nl/')) return '/nl/winkelmand.html';
    return '/panier.html'; // Default to French
}

// Function to display cart
function displayCart() {
    window.location.href = getCartURL();
}

// Initial call to update the shopping cart button on page load
updateCartButton();








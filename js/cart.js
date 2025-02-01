
document.querySelectorAll('.qtyhandlers').forEach(button => {
    button.addEventListener('click', (event) => {
        const action = event.target.getAttribute('data-action');
        const qtyElement = event.target.closest('.qtycontrols').querySelector('.qtyamount');
        let currentQty = parseInt(qtyElement.textContent);

        if (action === 'plusitem') {
            qtyElement.textContent = currentQty + 1;
        } else if (action === 'minusitem' && currentQty > 1) {
            qtyElement.textContent = currentQty - 1;
        }
    });
});

document.querySelectorAll('[data-cartbtn]').forEach(button => {
    const productId = button.getAttribute('data-cartbtn');
    const productName = button.getAttribute('data-cartbtn-name');
    let cart = {};
    const cartData = localStorage.getItem('cart');
    
    if (cartData) {
        try {
            cart = JSON.parse(cartData);
        } catch (e) {
            console.error("Error parsing cart data", e);
        }
    }

    if (cart[productId]) {
        addCheckIcon(button);
    }

    button.addEventListener('click', (event) => {
        const qtyElement = event.target.closest('.holderqtyandaddbtn').querySelector('.qtyamount');
        const quantity = parseInt(qtyElement.textContent);

        if (quantity >= 1) {
            addToCart(productId, quantity, productName);
            if (!button.nextElementSibling?.classList.contains("dummyclass")) {
                addCheckIcon(button);
            }
        }
    });
});

function addCheckIcon(button) {
    const language = getLanguage();
    const checkText = {
        en: `Added to cart`,
        nl: `Toegevoegd aan winkelmand`,
        fr: `Ajouté au panier.`
    };
    const checkIcon = document.createElement('div');
    checkIcon.classList.add("alwaysflexhorizontal");
    checkIcon.classList.add("dummyclass");
    checkIcon.innerHTML = `
        <img src="/images/check.svg" loading="lazy" class="checkicon">
        <div class="small-text">${checkText[language]}</div>
    `
    button.insertAdjacentElement('afterend', checkIcon);
}

function addToCart(productId, quantity, productName) {
    let cart = {};
    const cartData = localStorage.getItem('cart');
    
    if (cartData) {
        try {
            cart = JSON.parse(cartData);
        } catch (e) {
            console.error("Error parsing cart data", e);
        }
    }

    cart[productId] = (cart[productId] || 0) + quantity;

    localStorage.setItem('cart', JSON.stringify(cart));

    updateCartButton();

    const totalItems = Object.values(cart).reduce((sum, qty) => sum + qty, 0);

    showPopup(productName, quantity, totalItems);
}

function updateCartButton() {
    let cart = {};
    const cartData = localStorage.getItem('cart');
    
    if (cartData) {
        try {
            cart = JSON.parse(cartData);
        } catch (e) {
            console.error("Error parsing cart data", e);
        }
    }
    const uniqueItemsCount = Object.keys(cart).length;

    let cartButton = document.querySelector('.shoppingcartbtn');
    if (!cartButton && uniqueItemsCount > 0) {
        cartButton = document.createElement('a');
        cartButton.className = "shoppingcartbtn opencart";
        cartButton.innerHTML = `<div class="cart-button"><img src="/images/8726224_shopping_cart_icon.svg" loading="lazy" alt=""><div class="nritems">${uniqueItemsCount}</div></div>`;
        document.body.appendChild(cartButton);

        cartButton.addEventListener('click', displayCart);
    } else if (cartButton) {
        const nritems = cartButton.querySelector('.nritems')
        if (nritems) {
        nritems.textContent = uniqueItemsCount;
        }
    }
}

let popupZIndex = 10;
// Function to show the popup
function showPopup(item, quantity, totalItemNr) {
    const language = getLanguage();
    const popupText = {
        en: `${quantity}x ${item} added to cart`,
        nl: `${quantity}x ${item} toegevoegd aan winkelmand`,
        fr: `${quantity}x ${item} ajouté au panier`
    };

    const popupUnderText = {
        en: `You have currently selected ${totalItemNr} boxes in total`,
        nl: `U heeft momenteel in totaal ${totalItemNr} dozen geselecteerd`,
        fr: `Vous avez actuellement sélectionné ${totalItemNr} boîtes au total`
    };

    const goToCartText = {
        en: "Go to cart",
        nl: "Naar winkelmandje",
        fr: "Aller au panier"
    };

    const cartLink = {
        en: "/en/shopping-cart",
        nl: "/nl/winkelmand",
        fr: "/panier"
    };


    popupZIndex ++;

    const popupHTML = `
        <div class="productedselecteddiv" style="z-index: ${popupZIndex};">
            <div class="bold-text">${popupText[language]}</div>
            <div class="small-text">${popupUnderText[language]}</div>
            <a class="button intypeholder" href="${cartLink[language]}" style="color: #fff">${goToCartText[language]}</a>
            </div>
    `;

    // Append popup to body
    document.body.insertAdjacentHTML('beforeend', popupHTML);

    const popupElement = document.body.lastElementChild;

    // Remove the popup after 6 seconds
    setTimeout(() => {
        if (popupElement) {
            popupElement.remove();
        }
    }, 6000);

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








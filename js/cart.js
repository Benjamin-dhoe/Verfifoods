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
    button.addEventListener('click', (event) => {
        const productId = event.target.getAttribute('data-cartbtn');
        const qtyElement = event.target.closest('.holderqtyandaddbtn').querySelector('.qtyamount');
        const quantity = parseInt(qtyElement.textContent);

        if (quantity >= 1) {
            addToCart(productId, quantity);
        } else {
            alert('Please select a valid quantity');
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
    alert('Product added to cart!');
}

// Optional: function to display cart contents (can be added later)
function displayCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || {};
    console.log(cart);
}



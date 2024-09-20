// Function to handle quantity change
document.querySelectorAll('.qtyhandlers').forEach(button => {
    button.addEventListener('click', (event) => {
        const action = event.target.getAttribute('data-action');
        const input = event.target.closest('.qtycontrols').querySelector('.qtyamount');
        let currentQty = parseInt(input.value);

        // Update quantity based on the button clicked (plus or minus)
        if (action === 'plusitem') {
            input.value = currentQty + 1;
        } else if (action === 'minusitem' && currentQty > 1) {
            input.value = currentQty - 1;
        }
    });
});

// Function to handle adding to cart
document.querySelectorAll('[data-cartbtn]').forEach(button => {
    button.addEventListener('click', (event) => {
        const productId = event.target.getAttribute('data-cartbtn');
        const qtyInput = event.target.closest('.holderqtyandaddbtn').querySelector('.qtyamount');
        const quantity = parseInt(qtyInput.value);

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

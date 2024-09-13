function updateProductDetails(productName) {
    const product = products.find(p => p.name === productName);

    if (product) {
        const smoothieImage = document.querySelector('.smoothieimage');

        // Add rotation animation class
        smoothieImage.classList.add('rotate');

        // Set a timeout to change the image after the rotation starts
        setTimeout(() => {
            // Update smoothie image
            smoothieImage.src = product.image;

            // Remove the rotation class after animation completes to reset it
            smoothieImage.classList.remove('rotate');
        }, 300);  // Half of the animation time (to switch image mid-rotation)

        // Update ingredients image
        document.querySelector('.ingredientssmoothieimage').src = product.ingredientImage;

        // Update ingredients list
        const ingredientsHolder = document.querySelector('.smoothieingredientsholder');
        ingredientsHolder.innerHTML = '';
        product.ingredients.forEach(ingredient => {
            const ingr = document.createElement('div');
            ingr.classList.add('brownundertitle', 'blue', 'italic');
            ingr.textContent = ingredient;
            ingredientsHolder.appendChild(ingr);
        });

        // Update the background gradient
        const colorSourceElement = document.querySelector('.colorsourcesmoothies');
        if (colorSourceElement) {
            const gradientColor = `#${product.colour}`;
            colorSourceElement.style.backgroundImage = `radial-gradient(circle farthest-corner at 50% 100%, ${gradientColor}, #fffcf8 53%)`;
        }
    }
}

// Function to handle adding/removing 'active' class
function handleActiveClass(productElement) {
    // Remove 'active' class from all product elements
    document.querySelectorAll('[product]').forEach(el => {
        el.classList.remove('active');
    });

    // Add 'active' class to the clicked element
    productElement.classList.add('active');
}

// Event delegation to handle clicks on product elements
document.body.addEventListener('click', function (event) {
    const productElement = event.target;

    if (productElement.hasAttribute('product')) {
        const productName = productElement.getAttribute('product');
        updateProductDetails(productName);

        // Handle the 'active' class toggle
        handleActiveClass(productElement);
    }
});
let currentProductIndex = 0;  // Track the current product index

function preloadImages() {
    products.forEach(product => {
        const smoothieImage = new Image();
        smoothieImage.src = product.image;

        const ingredientImage = new Image();
        ingredientImage.src = product.ingredientImage;
    });
}

// Call this function right when the script is read
preloadImages();

// Function to update product details
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

        // Update the current product title
        const currentTitleElement = document.querySelector('[currentTitle]');
        if (currentTitleElement) {
            currentTitleElement.textContent = product.name;
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

// Function to navigate to the next or previous product
function navigateProducts(direction) {
    if (direction === 'next') {
        currentProductIndex = (currentProductIndex + 1) % products.length; // Loop back to the first product
    } else if (direction === 'prev') {
        currentProductIndex = (currentProductIndex - 1 + products.length) % products.length; // Loop to the last product
    }
    const nextProduct = products[currentProductIndex];
    updateProductDetails(nextProduct.name);
}

// Event delegation to handle clicks on product elements
document.body.addEventListener('click', function (event) {
    const productElement = event.target;

    // Handle product click
    if (productElement.hasAttribute('product')) {
        const productName = productElement.getAttribute('product');
        currentProductIndex = products.findIndex(p => p.name === productName); // Update the current index
        updateProductDetails(productName);

        // Handle the 'active' class toggle
        handleActiveClass(productElement);
    }

    // Handle previous button click
    if (productElement.hasAttribute('prevbtn')) {
        navigateProducts('prev');
    }

    // Handle next button click
    if (productElement.hasAttribute('nextbtn')) {
        navigateProducts('next');
    }
});

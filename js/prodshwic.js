let currentProductIndex = 0;

function preloadImages() {
    products.forEach(product => {
        const smoothieImage = new Image();
        smoothieImage.src = product.image;

        const ingredientImage = new Image();
        ingredientImage.src = product.ingredientImage;
    });
}

preloadImages();


function updateProductDetails(productName) {
    const product = products.find(p => p.name === productName);

    if (product) {
        const smoothieImage = document.querySelector('.smoothieimage');

        smoothieImage.classList.add('rotate');

        setTimeout(() => {
            smoothieImage.src = product.image;

            setTimeout(() => {
            smoothieImage.classList.remove('rotate');
            }, 300);  
        }, 300);


      const currentLongTitleElement = document.querySelector('[currentLongTitle]');
        if (currentLongTitleElement) {
            currentLongTitleElement.textContent = product.longname;
        }

        const colorSourceElement = document.querySelector('.colorsourcesmoothies');
        if (colorSourceElement) {
            const gradientColor = `#${product.colour}`;
            colorSourceElement.style.backgroundImage = `radial-gradient(circle farthest-corner at 50% 100%, ${gradientColor}, #fffcf8 53%)`;
        }

        const currentTitleElement = document.querySelector('[currentTitle]');
        if (currentTitleElement) {
            currentTitleElement.textContent = product.name;
        }
    }
}

function navigateProducts(direction) {
    if (direction === 'next') {
        currentProductIndex = (currentProductIndex + 1) % products.length; // Loop back to the first product
    } else if (direction === 'prev') {
        currentProductIndex = (currentProductIndex - 1 + products.length) % products.length; // Loop to the last product
    }
    const nextProduct = products[currentProductIndex];
    updateProductDetails(nextProduct.name);
}


    // Handle previous button click
    if (productElement.hasAttribute('prevbtn')) {
        navigateProducts('prev');
    }

    // Handle next button click
    if (productElement.hasAttribute('nextbtn')) {
        navigateProducts('next');
    }

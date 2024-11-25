const cloudFunctionURL = "https://europe-west1-your-project-id.cloudfunctions.net/getCart";

// Show the loading spinner
function showLoadingSpinner() {
    const loadingSpinner = document.getElementById('loadingSpinner');
    loadingSpinner.style.display = 'flex';
}

// Hide the loading spinner
function hideLoadingSpinner() {
    const loadingSpinner = document.getElementById('loadingSpinner');
    loadingSpinner.style.display = 'none';
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
async function fetchCartDetailsFromCloudFunction(cart) {
    const params = new URLSearchParams();

    if (cart) params.append("cart", cart);

    const response = await fetch(`${cloudFunctionURL}?${params.toString()}`);
    if (!response.ok) {
        console.error("Failed to fetch products:", response.statusText);
        return [];
    }

    return await response.json();
}

fetchCartDetailsFromCloudFunction(null);





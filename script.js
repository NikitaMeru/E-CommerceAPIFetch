const API_URL = 'https://cdn.shopify.com/s/files/1/0564/3685/0790/files/multiProduct.json';
let categories = []; 
let wishlist = [];

const fetchData = async () => {
    try {
        const res = await fetch(API_URL);
        const data = await res.json();
        categories = data.categories; 
        displayProducts(categories);

        document.getElementById('men-button').addEventListener('click', () => displayFilteredProducts('Men'));
        document.getElementById('women-button').addEventListener('click', () => displayFilteredProducts('Women'));
        document.getElementById('kids-button').addEventListener('click', () => displayFilteredProducts('Kids'));
        document.getElementById('search-input').addEventListener('input', () => displayFilteredProducts());
        document.getElementById('wishlist-items-button').addEventListener('click', () => showWishlistedItems());
        
    } catch (err) {
        console.error("Error with fetching Api", err);
    }
}

function displayProducts(categories, isWishlistedView = false) {
    const productList = document.getElementById('product-list');
    productList.innerHTML = '';
    categories.forEach(category => {
        category.category_products.forEach(product => {
            const productItem = createProductElement(product, isWishlistedView);
            productList.appendChild(productItem);
        });
    });
}

function createProductElement(product, isWishlistedView = false) {
    const productItem = document.createElement('div');
    productItem.innerHTML = `
        <div class="product-details">
            <h3 class="mt-4">${product.title}</h3>
            <div class="product-images">
                <img src="${product.image}" alt="${product.title}" width="150">
               
            </div>
            <p class="price">Price: ${product.price}</p>
            <p class="compare-price">Compare at price: ${product.compare_at_price}</p>
            <p class="vendor">${product.vendor}</p>
            <p class="badge-text">${product.badge_text}</p>
            <div class="buy">
            <button class="btn btn-info add-to-cart">Add To Cart </button>
            <button class="btn  ${isWishlistedView ? 'remove-from-wishlist btn-danger' : 'add-to-wishlist btn-secondary'}" data-product-id="${product.id}">
                ${isWishlistedView ? 'Remove' : 'Wishlist'}
            </button>
        </div>
        </div>
        
    `;

    const button = productItem.querySelector(`.${isWishlistedView ? 'remove-from-wishlist' : 'add-to-wishlist'}`);
    if (isWishlistedView) {
        button.addEventListener('click', () => removeFromWishlist(product));
    } else {
        if (isInWishlist(product)) {
            button.disabled = true;
        } else {
            button.addEventListener('click', () => addToWishlist(product));
        }
    }

    return productItem;
}

function addToWishlist(product) {
    wishlist.push(product);
    updateProductButtons(product);
}

function removeFromWishlist(product) {
    wishlist = wishlist.filter(item => item.id !== product.id);
    showWishlistedItems();
}

function isInWishlist(product) {
    return wishlist.some(item => item.id === product.id);
}

function updateProductButtons(product) {
    const addToWishlistBtns = document.querySelectorAll('.add-to-wishlist');
    addToWishlistBtns.forEach(btn => {
        const productId = btn.getAttribute('data-product-id');
        if (productId === product.id.toString()) {
            btn.disabled = isInWishlist(product);
        }
    });

    const removeFromWishlistBtns = document.querySelectorAll('.remove-from-wishlist');
    removeFromWishlistBtns.forEach(btn => {
        const productId = btn.getAttribute('data-product-id');
        if (productId === product.id.toString()) {
            btn.disabled = !isInWishlist(product);
        }
    });
}

function showWishlistedItems() {
    const productList = document.getElementById('product-list');
    if (wishlist.length === 0) {
        productList.innerHTML =
         '<div><h5>Wishlist your fav products !!</h5><p>your wishlist is Empty :(</p></div>';
    } else {
        const filteredWishlist = {
            category_name: 'Wishlisted Items',
            category_products: wishlist.slice() 
        };

        displayProducts([filteredWishlist], true);
    }
}

function displayFilteredProducts(categoryName = null) {
    const query = document.getElementById('search-input').value.toLowerCase();
    const filteredCategories = [];

    categories.forEach(category => {
        if (!categoryName || category.category_name === categoryName) {
            const matchingProducts = category.category_products.filter(product =>
                (product.title?.toLowerCase().includes(query)) ||
                (product.vendor?.toLowerCase().includes(query)) ||
                (product.price?.toString().toLowerCase().includes(query)) ||
                (product.compare_at_price?.toString().toLowerCase().includes(query)) ||
                (product.badge_text?.toLowerCase().includes(query))
            );
            if (matchingProducts.length) {
                filteredCategories.push({
                    category_name: category.category_name,
                    category_products: matchingProducts
                });
            }
        }
    });

    displayProducts(filteredCategories);
}

fetchData();
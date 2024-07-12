
const API_URL = 'https://cdn.shopify.com/s/files/1/0564/3685/0790/files/multiProduct.json';

const fetchData = async () => {
    try {
        const res = await fetch(API_URL);
        const data = await res.json();
        
        // Check if product-list element exists
        const productList = document.getElementById('product-list');
        if (!productList) {
            throw new Error('Element with id "product-list" not found in DOM.');
        }

        displayProducts(data.categories, productList);

        document.getElementById('men-button').addEventListener('click', () => displayFilteredProducts(data.categories, 'Men', productList));
        document.getElementById('women-button').addEventListener('click', () => displayFilteredProducts(data.categories, 'Women', productList));
        document.getElementById('kids-button').addEventListener('click', () => displayFilteredProducts(data.categories, 'Kids', productList));

    } catch (err) {
        console.error("Error with fetching Api", err);
    }
}

function displayProducts(categories, productList) {
    productList.innerHTML = '';
    categories.forEach(category => {
        category.category_products.forEach(product => {
            const productItem = document.createElement('div');
            productItem.classList.add('product-item');
            productItem.innerHTML = `
                <div class="product-details">
                    <h3>${product.title}</h3>
                    <div class="product-images">
                        <img src="${product.image}" alt="${product.title}" width="100">
                        <img src="${product.second_image}" alt="${product.title}" width="100">
                    </div>
                    <p>Price: ${product.price}</p>
                    <p>Compare at price: ${product.compare_at_price}</p>
                    <p>Vendor: ${product.vendor}</p>
                    <p>${product.badge_text}</p>
                    <button class="btn">Buy Now</button>
                    <button class="btn">Add to Cart</button>
                </div>
            `;
            productList.appendChild(productItem);
        });
    });
}

function displayFilteredProducts(categories, categoryName, productList) {
    const filteredProducts = categories.filter(cate => cate.category_name === categoryName);
    displayProducts(filteredProducts, productList);
}

fetchData();


var AllProductsData = [];
var FilteredProducts = [];

window.onload = async () => {
    let [innerProducts, innerCategories] = await window.fetchProductsData();
    AllProductsData = innerProducts;
    FilteredProducts = innerProducts;
    console.log(innerProducts)
    displayProducts(FilteredProducts)
    document.getElementById('search-form').addEventListener('submit', (e) => {
        e.preventDefault();
        searchProducts();
    });
}

function searchProducts() {
    var searchQuery = document.getElementById("products-search-bar").value;
    FilteredProducts = AllProductsData.filter((product) => {
        return product.product_name.toLowerCase().includes(searchQuery.toLowerCase());
    });
    displayProducts(FilteredProducts);
}

function displayProducts(FilteredProducts) {
    const searchResults = document.getElementById('search_results')
    var output = ``
    for (let i = 0; i < FilteredProducts.length; i++) {
        var product = FilteredProducts[i];
        var productCard = makeProductCard(product)
        output += productCard;
    }
    searchResults.innerHTML = output;
}

function makeProductCard(productData) {

    const {
        product_id,
        product_name,
        actual_price,
        category,
        img_link
    } = productData

    const url = `ProductsViewPage.html?product_id=${product_id}`


    return `
				<div
					class="w-full rounded-lg bg-[#f8f8f8] shadow-lg border-gray-300 px-2 py-4" id="${product_id}"
				>
					<img
						src="${img_link}"
                        onerror="
                             this.src='../assets/Products/no-image-found.png'; 
                             this.style.backgroundColor='transparent'   
                        "
						alt=""
						class="product-image w-full h-[300px] bg-white object-contain rounded-t-lg"
					/>

					<div
						class="w-full text-base radio-canada-big product-card-details-section pt-4 flex flex-col gap-2"
					>
						<span
							class="product-card-category font-bold text-lg h-[]"
						>
                            ${category[0]}
						</span>

						<span
							class="product-card-product-name text-sm cursor-pointer hover:text-red-500 transition-all duration-500 line-clamp-2 h-10"
                            onclick="window.location.href='${url}'"
						>
                        ${product_name}
						</span>

						<span
							class="product-card-product-price text-xl font-semibold text-gray-900 mt-2"
						>
                        $${actual_price}
						</span>

						<div
							class="w-full flex flex-col lg:flex-row items-stretch gap-2 justify-evenly mt-4"
						>
							<button
								class="bg-gray-800 text-white rounded-lg py-2 px-4 hover:bg-gray-700 transition-all duration-300 text-sm font-semibold nunito-sans"
                                onclick="window.addToCart('${product_id}')"
							>
								Add to Cart
							</button>

							<!-- View Product -->

							<button
								class="bg-gray-800 text-white rounded-lg py-2 px-4 hover:bg-gray-700 transition-all duration-300 text-sm font-semibold nunito-sans"
                                onclick="window.location.href='${url}'"
							>
								View Product
							</button>
						</div>
					</div>
				</div>
    
    `;
}
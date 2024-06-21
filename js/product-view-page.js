window.onload = () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const productId = urlParams.get('product_id');
    console.log(productId);

    if (productId == null || productId == undefined) {
        window.location.href = "index.html";
    }

    const AllProducts = JSON.parse(localStorage.getItem('products'));

    const product = AllProducts.find((product) => product.product_id === productId);

    document.title = product.product_name || "Product View Page"

    setDetails(product)
    setRelatedProducts(product, AllProducts)
}


function setDetails(product) {
    const product_image = document.getElementById('productViewImg');
    product_image.src = product.img_link;

    const category = document.getElementById('category');
    category.innerHTML = product.category[0];

    const product_name = document.getElementById('productName');
    product_name.innerHTML = product.product_name;

    const product_price = document.getElementById('productPrice');
    product_price.innerHTML = "$" + product.actual_price;

    const rating_count = document.getElementById('numberOfReviews');
    rating_count.innerHTML = product.rating_count + " reviews";

    const description = document.getElementById('productDescription');
    description.innerHTML = product.about_product;

    const addToCartBtn = document.getElementById('addToCartBtn');
    addToCartBtn.onclick = () => addToCart(product.product_id);
}

function setRelatedProducts(product, AllProducts) {
    const category = product.category
    // find if any of the category is matching with any of the category in AllProducts

    const relatedProducts = AllProducts.filter((product) =>
        product.category.some((cat) => category.includes(cat))
    ).slice(0, 8);

    console.log(relatedProducts)

    const relatedProductsContainer = document.getElementById('relatedProducts');

    relatedProductsContainer.innerHTML = relatedProducts.map((product) => makeProductCard(product)).join('');

    console.log(relatedProducts)
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
                                onclick="addToCart(${productData})"
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
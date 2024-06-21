
var products = [];

var selectedProducts = watch(products, (filteredProducts) => {
    let end = 12;
    if (filteredProducts.length < 12) {
        end = filteredProducts.length;
    }
    setProductCards(filteredProducts, 0, end)
});

var filters = watch({
    categories: [],
    price: {
        min: 0,
        max: 1500
    }
}, (newFilters) => {
    document.getElementById("filtered-price-max-value").innerHTML = newFilters.price.max;
    document.getElementById("filtered-price-min-value").innerHTML = newFilters.price.min;

    const result = products.filter((product) => {
        if (newFilters.categories.length == 0) {
            if (newFilters.price.max == 1500) {
                if (product.actual_price >= newFilters.price.min) {
                    return product
                }
            } else {
                if (product.actual_price >= newFilters.price.min && product.actual_price <= newFilters.price.max) {
                    return product
                }
            }
        } else {
            if (product.category.some((category) => newFilters.categories.includes(category))) {
                if (newFilters.price.max == 1500) {
                    if (product.actual_price >= newFilters.price.min) {
                        return product
                    }
                } else {
                    if (product.actual_price >= newFilters.price.min && product.actual_price <= newFilters.price.max) {
                        return product
                    }
                }
            }
        }
    })

    selectedProducts.value = result;
});

var AllCategories = watch([], (categories) => {
    setCategoriesSection(categories)
});

function updatePriceRange(e) {
    if (e === undefined) {
        return;
    }
    const target = document.getElementById(e.id);
    const status = target.getAttribute('data-status');

    var priceRange = parseInt(target.value);
    if (status == 'min') {
        filters.value = {
            ...filters.value,
            price: {
                min: priceRange,
                max: filters.value.price.max
            }
        }
    } else {
        filters.value = {
            ...filters.value,
            price: {
                min: filters.value.price.min,
                max: priceRange
            }
        }
    }

    if (filters.value.price.max < filters.value.price.min) {
        filters.value = {
            ...filters.value,
            price: {
                min: filters.value.price.min,
                max: filters.value.price.min
            }
        }
        target.value = filters.value.price.min;
    }
}

window.onload = async () => {
    const [innerProducts, innerCategories] = await window.fetchProductsData();
    products = innerProducts;
    setProductCards(products, 0, 12);

    const queryString = window.location.search
    const urlParams = new URLSearchParams(queryString)
    var category_param = urlParams.get('category')
    if (category_param != null) {
        filters.value = {
            ...filters.value,
            categories: [category_param]
        }
    }

    AllCategories.value = innerCategories;

}

function csvJson(csv) {
    // Split the CSV data by new lines to get each row
    const lines = csv.trim().split('\n');

    // Extract the headers by splitting the first line
    const headers = parseCSVLine(lines[0]);

    // Initialize an array to hold the JSON data
    const jsonData = [];

    // Iterate over each line (skipping the first line with headers)
    for (let i = 1; i < lines.length; i++) {
        const obj = {};
        const currentLine = parseCSVLine(lines[i]);

        // Assign the values to the corresponding headers
        headers.forEach((header, index) => {
            obj[header.trim()] = currentLine[index].trim();
        });

        // Add the current object to the JSON array
        jsonData.push(obj);
    }

    // Return the JSON array
    return jsonData;
}

function parseCSVLine(line) {
    const result = [];
    let insideQuotes = false;
    let value = '';

    for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === '"' && (i === 0 || line[i - 1] !== '\\')) {
            insideQuotes = !insideQuotes;
        } else if (char === ',' && !insideQuotes) {
            result.push(value);
            value = '';
        } else {
            value += char;
        }
    }
    result.push(value); // Add the last value

    // Remove surrounding quotes and unescape double quotes
    return result.map(val => val.replace(/^"(.*)"$/, '$1').replace(/""/g, '"'));
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

function cleanCategories(categories) {
    const seperatedValues = categories.split("|").map((category) => category.trim());
    const output = [];
    for (const category of seperatedValues) {
        const splittedValue = splitCamelCase(category).join(" ");
        if (splittedValue.includes("&")) {
            output.push(splittedValue.split("&").join(" & "));
        } else {
            output.push(splittedValue);
        }


    }

    return output;
}

function splitCamelCase(word) {
    return word
        .replace(/([a-z])([A-Z])/g, '$1 $2')  // Insert space before each capital letter preceded by a lowercase letter
        .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')  // Handle acronyms followed by a regular word part
        .replace(/([0-9])([A-Z])/g, '$1 $2')  // Handle numbers followed by capital letters
        .trim() // Remove any leading/trailing spaces
        .split(' '); // Split the string into an array of words
}

function setProductCards(productData, start, end) {
    if (start == 0) {
        document.getElementById('product-cards-list-container').innerHTML = "";
    }

    const productCards = productData.slice(start, end).map((product) => {
        return makeProductCard(product);
    });

    document.getElementById('product-cards-list-container').innerHTML += productCards.join("");
    document.getElementById("product-page-load-more-btn").setAttribute('data-end', end)

    if (end >= productData.length) {
        document.getElementById('product-page-load-more-btn').classList.add('hidden');
    } else {
        document.getElementById('product-page-load-more-btn').classList.remove('hidden');
    }
}

function loadMore() {
    const end = parseInt(document.getElementById("product-page-load-more-btn").getAttribute('data-end'));

    if (selectedProducts.value.length == 0) {
        setProductCards(products, end, end + 6);
    } else {
        setProductCards(selectedProducts.value, end, end + 6);
    }
}

function setCategoriesSection(categories) {
    let max = 5;
    let output = ``;

    const selectedCategories = [];

    if (filters.value.categories.length > 0) {
        output += `
        <li
            class="categories-filter-selector selected-category-filter"
            id="categories-filter-selector-category-all"
            onclick="this.classList.toggle('selected-category-filter');
            updateCategory('')"
            data-category="${filters.value.categories[0]}"
        >
            ${filters.value.categories[0]}
        </li>`
        max -= 1;
    }

    for (let i = 0; i < max; i++) {
        const randomCategory = categories[getRandomInt(0, categories.length - 1)];
        selectedCategories.push(randomCategory);
    }

    console.log(selectedCategories)



    for (let i = 0; i < selectedCategories.length; i++) {
        const category = selectedCategories[i];
        output += `
        <li
            class="categories-filter-selector"
            id="categories-filter-selector-category-${i}"
            onclick="this.classList.toggle('selected-category-filter');
            updateCategory('${category}')"
            data-category="${category}"
        >
            ${category}
        </li>`
    }
    document.getElementById("categories-selector-container").innerHTML = output;
}

function updateCategory(category) {
    const categoryFilter = filters.value.categories;
    if (categoryFilter.includes(category)) {
        filters.value = {
            ...filters.value,
            categories: categoryFilter.filter((value) => value !== category)
        }
    } else {
        filters.value = {
            ...filters.value,
            categories: [...categoryFilter, category]
        }
    }
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
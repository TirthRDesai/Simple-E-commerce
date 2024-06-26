function watch(initialValue, callback) {
    let value = initialValue;
    return {
        get value() {
            return value;
        },
        set value(newValue) {
            if (value !== newValue) {
                value = newValue;
                callback(newValue);
            }
        }
    };

}

async function fetchProductsData() {
    let innerProducts = [];
    let innerCategories = [];

    if (localStorage.getItem('products') == null) {
        const productsDataResponseCsv = await fetch("https://query.data.world/s/ha67ewqa44twyiq3a7tzxwtrgcwfiz?dws=00000")
        const productsDataCsv = await productsDataResponseCsv.text();


        const uncleanedProducts = csvJson(productsDataCsv);

        const cleanedProducts = uncleanedProducts.map((product) => {
            const seperatedCategories = cleanCategories(product.category)

            return {
                ...product,
                category: seperatedCategories,
            }
        });

        localStorage.setItem('products', JSON.stringify(cleanedProducts));
        innerProducts = cleanedProducts
    } else {
        innerProducts = JSON.parse(localStorage.getItem('products'));
    }

    innerCategories = innerProducts.map((product) => product.category).flat().filter((value, index, self) => self.indexOf(value) === index);

    return [innerProducts, innerCategories];
}

function createProductCard(productData) {
    let { productId, imageSrc, productDescription, price, productName } = productData;

    if (productDescription === undefined) {
        productDescription = "";
    }

    if (price === undefined) {
        price = 0;
    }

    if (productName === undefined) {
        productName = "";
    }

    return `
        <div class="productCardContainer bg-[url('${imageSrc}')]" id="productCard"+${productId}>
        <div class="productCardOverlay">
          <div class = "productCardItems"></div>
          <div class = "productCardItems productCardHead">
            <p class="radio-canada-big ">${productName}</p>
            <hr>
            
          </div>
          <p class="productCardDescription line-clamp-5"> ${productDescription} </p>
          <div class = "productCardItems productCardPrice flex flex-col gap-8 items-center justify-center h-1/4">
            <p class="OldPrice antialiased inter text-base">Price: $${price}</p>
          </div>
          <div class="productCardItems productCardCart">
            <i class="fa fa-shopping-cart"></i>
            <span onclick = "addToCart(${productData})">ADD TO CART</span>
        </div>
      </div>
      </div>
        `
}


function addToCart(product_id) {
    const Toast = Swal.mixin({
        toast: true,
        position: "bottom-end",
        showConfirmButton: false,
        timer: 3000
    });
    const cart = localStorage.getItem('cart');

    if (cart === null) {
        localStorage.setItem('cart', JSON.stringify([product_id]));
    } else {
        const cartArray = JSON.parse(cart);
        if (cartArray.includes(product_id) == false) {
            cartArray.push(product_id);
        } else {
            Toast.fire({
                title: "Product Already in Cart",
                icon: "warning",
            });
            return;
        }
        localStorage.setItem('cart', JSON.stringify(cartArray));
    }


    Toast.fire({
        title: "Product Added to Cart",
        icon: "success",
    });
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

window.createProductCard = createProductCard;
window.addToCart = addToCart;
window.watch = watch;
window.fetchProductsData = fetchProductsData;
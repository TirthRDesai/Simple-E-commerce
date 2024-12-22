window.onload = async () => {

    const [innerProducts, innerCategories] = await window.fetchProductsData()

    const products = innerProducts
    const cart = JSON.parse(localStorage.getItem('cart'))

    if (cart === null) {
        return
    }


    const cartItems = cart.map(item => {
        return products.find(product => product.product_id === item)
    })


    const cartItemsDiv = document.getElementById('cartItemsList')

    let output = ``;

    for (let i = 0; i < cartItems.length; i++) {
        output += itemDetailTemplate(cartItems[i])
    }


    cartItemsDiv.innerHTML = output

    updatePricing()
}

function removeCartItems(product_id) {
    // Remove the item from the cart
    const items = localStorage.getItem('cart')
    const cart = JSON.parse(items)

    const updatedCart = cart.filter(item => item !== product_id)

    localStorage.setItem('cart', JSON.stringify(updatedCart))

    updatePricing()
}

function updatePricing() {
    const cart = JSON.parse(localStorage.getItem('cart'))

    const products = JSON.parse(localStorage.getItem('products'))

    const cartItems = cart.map(item => {
        return products.find(product => product.product_id === item)
    })

    let total = 0

    for (let i = 0; i < cartItems.length; i++) {
        const product = cartItems[i]

        const quantity = parseInt(document.getElementById(`counter-input-${product.product_id}`).value)

        total += parseFloat(product.actual_price.split(',').join('')) * quantity
    }

    document.getElementById('originalPrice').innerText = `$${total.toFixed(2)}`

    const deliveryFee = 0;
    document.getElementById('deliveryFee').innerText = `$${deliveryFee.toFixed(2)}`

    const tax = (total * 0.1).toFixed(2)
    document.getElementById('tax').innerText = "$" + tax

    const grandTotal = total + deliveryFee + parseFloat(tax)
    document.getElementById('grandTotal').innerText = `$${grandTotal.toFixed(2)}`
}

function updateInnerPrice(product_id, quantity, actual_price) {
    const price = parseFloat(actual_price.split(',').join('')) * quantity

    document.getElementById(`cartItemPrice-${product_id}`).innerText = `$${price.toFixed(2)}`

    updatePricing()
}

function itemDetailTemplate(details) {
    const {
        product_id,
        product_name,
        actual_price,
        img_link
    } = details


    console.log(details)

    return `
        <div
		    class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 md:p-6"
            id="product_in_cart_main_div_${product_id}"
			>
            <div
                class="space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0"
            >
                <a
                    href="#"
                    class="shrink-0 md:order-1"
                >
                    <img
                        class="h-20 w-20"
                        src="${img_link}"
                        alt="Product-#${product_id}"
                    />
                </a>

                <label
                    for="counter-input"
                    class="sr-only"
                    >Choose quantity:</label
                >
                <div
                    class="flex items-center justify-between md:order-3 md:justify-end"
                >
                    <div class="flex items-center">
                        <button
                            type="button"
                            id="decrement-button"
                            data-input-counter-decrement="counter-input"
                            class="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700"
                            onclick="this.nextElementSibling.value = Math.max(1, parseInt(this.nextElementSibling.value) - 1)
                            
                            updateInnerPrice('${product_id}', this.nextElementSibling.value, '${actual_price}')

                            updateTotalPricing()
                            "
                        >
                            <svg
                                class="h-2.5 w-2.5 text-gray-900 dark:text-white"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 18 2"
                            >
                                <path
                                    stroke="currentColor"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M1 1h16"
                                />
                            </svg>
                        </button>
                        <input
                            type="text"
                            id="counter-input-${product_id}"
                            data-input-counter
                            class="w-10 shrink-0 border-0 bg-transparent text-center text-sm font-medium text-gray-900 focus:outline-none focus:ring-0 dark:text-white"
                            placeholder=""
                            value="1"
                            required
                        />
                        <button
                            type="button"
                            id="increment-button"
                            data-input-counter-increment="counter-input"
                            class="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700"
                            onclick="this.previousElementSibling.value = parseInt(this.previousElementSibling.value) + 1

                            updateInnerPrice('${product_id}', this.previousElementSibling.value, '${actual_price}')

                            updateTotalPricing()
                            "
                        >
                            <svg
                                class="h-2.5 w-2.5 text-gray-900 dark:text-white"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 18 18"
                            >
                                <path
                                    stroke="currentColor"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M9 1v16M1 9h16"
                                />
                            </svg>
                        </button>
                    </div>
                    <div
                        class="text-end md:order-4 md:w-32"
                    >
                        <p
                            class="text-base font-bold text-gray-900 dark:text-white"
                            id='cartItemPrice-${product_id}'
                        >
                            $${(parseFloat(actual_price.split(',').join('')) * 1).toFixed(2)}
                        </p>
                    </div>
                </div>

                <div
                    class="w-full min-w-0 flex-1 space-y-4 md:order-2 md:max-w-md"
                >
                    <a
                        href="../ProductsViewPage.html?product_id=${product_id}"
                        class="text-base font-medium text-gray-900 hover:underline dark:text-white"
                        >${product_name}</a
                    >

                    <div class="flex items-center gap-4">

                        <button
                            type="button"
                            class="inline-flex items-center text-sm font-medium text-red-600 hover:underline dark:text-red-500"
                            onclick= "
                                document.getElementById('product_in_cart_main_div_${product_id}').remove();

                                removeCartItems('${product_id}')
                            "
                        >
                            <svg
                                class="me-1.5 h-5 w-5"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke="currentColor"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M6 18 17.94 6M18 18 6.06 6"
                                />
                            </svg>
                            Remove
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `
}

function redirectToCheckoutPage() {
    const ProductDetails = []
    const cart = JSON.parse(localStorage.getItem('cart'))

    for (let i = 0; i < cart.length; i++) {
        const Product = {
            product_id: cart[i],
            quantity: document.getElementById(`counter-input-${cart[i]}`).value,
            price: document.getElementById(`cartItemPrice-${cart[i]}`).innerText
        }

        ProductDetails.push(Product)
    }

    const CartDetails = {
        originalPrice: document.getElementById('originalPrice').innerText,
        deliveryFee: document.getElementById('deliveryFee').innerText,
        tax: document.getElementById('tax').innerText,
        grandTotal: document.getElementById('grandTotal').innerText
    }

    const params = {
        ProductDetails,
        CartDetails
    }

    const encodedParams = btoa(JSON.stringify(params))

    window.location.assign('./Checkout.html?params=' + encodedParams)
}
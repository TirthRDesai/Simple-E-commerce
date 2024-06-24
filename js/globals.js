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

window.createProductCard = createProductCard;
window.addToCart = addToCart;
window.watch = watch;
window.fetchProductsData = fetchProductsData;
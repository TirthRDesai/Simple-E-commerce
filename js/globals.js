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


function addToCart(productData) {
    console.log(productData);
}

function addToLikedProducts(productData) {
    console.log(productData);
}

function productNameHovered(productName) {
    console.log(productName);
}

window.createProductCard = createProductCard;
window.addToCart = addToCart;
window.addToLikedProducts = addToLikedProducts;
window.productNameHovered = productNameHovered;
window.watch = watch;
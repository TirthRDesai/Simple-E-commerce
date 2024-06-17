function createProductCard(productData) {
  const { imageSrc, imageAlt, price, productName, oldPrice, newPrice } = productData;

  return `
  <div class="productCardContainer bg-[url('${imageSrc}')]">
  <div class="productCardOverlay">
    <div class = "productCardItems"></div>
    <div class = "productCardItems productCardHead">
      <p>${productName}</p>
      <hr>
    </div>
    <div class = "productCardItems productCardPrice flex flex-col gap-4">
      <p class="OldPrice">$699</p>
      <p class="NewPrice">$345</p>
    </div>
    <div class="productCardItems productCardCart">
      <i class="fa fa-shopping-cart"></i>
      <span>ADD TO CART</span>
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
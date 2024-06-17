var minPrice = 0;
var maxPrice = 10000;

function updatePriceRange(e) {
    if (e === undefined) {
        return;
    }
    const target = document.getElementById(e.id);
    const status = target.getAttribute('data-status');
    console.log(minPrice, maxPrice)
    var priceRange = parseInt(target.value);
    if (status == 'min') {
        minPrice = priceRange;
    } else {
        maxPrice = priceRange;
    }

    if (maxPrice < minPrice) {
        maxPrice = minPrice;
        target.value = minPrice;
    }
    console.log(maxPrice, minPrice)

    if (status == 'min') {
        target.nextElementSibling.innerHTML = minPrice;
    } else {
        target.nextElementSibling.innerHTML = maxPrice;
    }
}
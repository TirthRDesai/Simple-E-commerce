var AllProducts = [];
var productsData = watch([], (updatedProductsData) => {
    console.log("Products Updated")
    AllProducts = updatedProductsData;
})
var AllCategories = [];
var categories = watch([], (updatedCategories) => {
    console.log("Categories Updated")
    AllCategories = updatedCategories;

    setCards(updatedCategories)


})


window.onload = async () => {
    const [innerproducts, innercategories] = await fetchProductsData();
    productsData.value = innerproducts;
    categories.value = innercategories;

    createCards();
}

function setCards(updatedCategories) {
    const distinctCategories = [];
    let output = ``;

    while (distinctCategories.length != 11) {
        const random = updatedCategories[Math.floor(Math.random() * updatedCategories.length)]
        if (!distinctCategories.includes(random)) {
            distinctCategories.push(random)
        }
    }

    console.log(distinctCategories)


    for (let i = 0; i < distinctCategories.length; i++) {
        const random = Math.ceil(i % 3) + 1;
        console.log(random)
        const data = {
            image: `../assets/Categories/Category-${random}.png`,
            category: `Category-${i + 1}`,
            description: "Lorem ipsum dolor sit amet, consectetur adipii voluptas ten mollitia pariatur odit, ab minus ratione adipisci accusamus vel est excepturi laboriosam magnam dignissimos molestias."
        }
        output += createCards(data)
    }

    const container = document.getElementById('category-list-container')
    container.innerHTML = output;
}

function createCards(data) {
    const {
        image,
        category,
        description
    } = data;
    console.log(category)
    return `
    <div class="category-image-card-container cursor-pointer">
				<div class="category-image-card">
					<div class="img-content">
						<img
							src="${image}"
							alt="${category}"
							class="w-full h-full object-fill rounded-lg"
						/>
					</div>
					<div class="content">
						<p class="heading text-center">${category}</p>
						<p class="text-justify">
							${description}
						</p>
					</div>
				</div>
			</div>
            `
}
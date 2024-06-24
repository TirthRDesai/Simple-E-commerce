var details = {
    name: '',
    email: '',
    country: '',
    city: '',
    phone: '',
    address: '',
    postalCode: '',
    amount: ''
}

window.onload = () => {
    document.getElementById('delivery-details-form').addEventListener('submit', (e) => {
        e.preventDefault();
        setDeliveryDetails()
    })

    const urlParams = new URLSearchParams(window.location.search);
    const myParam = urlParams.get('params');

    const data = atob(myParam);

    const ProductDetails = JSON.parse(data).ProductDetails;
    const CartDetails = JSON.parse(data).CartDetails;

    console.log(CartDetails)
    document.getElementById('originalPrice').innerText = CartDetails.originalPrice;
    document.getElementById('deliveryFee').innerText = CartDetails.deliveryFee;
    document.getElementById('tax').innerText = CartDetails.tax;
    document.getElementById('grandTotal').innerText = CartDetails.grandTotal;
    details.amount = CartDetails.grandTotal;
}

function setDeliveryDetails() {
    details = {
        ...details,
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        country: document.getElementById('select-country-input-3').value,
        city: document.getElementById('select-city-input-3').value,
        phone: document.getElementById('phone-input').value,
        address: document.getElementById('address').value,
        postalCode: document.getElementById('pincode').value,
    }

    document.getElementById('name').disabled = true;
    document.getElementById('email').disabled = true;
    document.getElementById('select-country-input-3').disabled = true;
    document.getElementById('select-city-input-3').disabled = true;
    document.getElementById('phone-input').disabled = true;
    document.getElementById('address').disabled = true;
    document.getElementById('pincode').disabled = true;
    document.getElementById('dropdown-phone-button-3').disabled = true


    let submitBtn = document.getElementById('submitBtn');
    submitBtn.innerHTML = "Edit Details"


    submitBtn.addEventListener('click', () => {
        document.getElementById('name').disabled = false;
        document.getElementById('email').disabled = false;
        document.getElementById('select-country-input-3').disabled = false;
        document.getElementById('select-city-input-3').disabled = false;
        document.getElementById('phone-input').disabled = false;
        document.getElementById('address').disabled = false;
        document.getElementById('pincode').disabled = false;
        document.getElementById('dropdown-phone-button-3').disabled = false
        const submitBtn = document.getElementById('submitBtn')
        submitBtn.innerHTML = `<svg
											class="h-5 w-5"
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
												d="M5 12h14m-7 7V5"
											/>
										</svg>
										Add new address`

        submitBtn.addEventListener('click', (e) => {
            e.preventDefault();
            setDeliveryDetails()
        })
    })
}

function ProceedToPayment() {
    const isRequiredSatified = () => {
        if (details.name === '' || details.email === '' || details.country === '' || details.city === '' || details.phone === '' || details.address === '' || details.postalCode === '' || details.amount === '') {
            return false;
        }
        return true
    }

    console.log(isRequiredSatified())

    if (isRequiredSatified()) {
        window.sessionStorage.setItem('checkoutDetails', JSON.stringify(details));
        window.sessionStorage.setItem('OrderNumber', Math.floor(Math.random() * 1000000000));
        window.location.href = '../Confirmation.html';
    }
}
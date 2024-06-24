const monthName = {
    0: 'January',
    1: 'February',
    2: 'March',
    3: 'April',
    4: 'May',
    5: 'June',
    6: 'July',
    7: 'August',
    8: 'September',
    9: 'October',
    10: 'November',
    11: 'December'
}

window.onload = () => {
    const details = JSON.parse(window.sessionStorage.getItem('checkoutDetails'));

    if (details === undefined) {
        window.location.href = '../index.html'
    }

    console.log(details)
    document.getElementById('orderNumber').innerText = window.sessionStorage.getItem('OrderNumber');
    document.getElementById('name').innerText = details.name;
    document.getElementById('amount').innerText = details.amount;

    setDate()
    setAddress(details)

    document.getElementById('email').innerText = details.email;
    window.sessionStorage.clear()
    window.localStorage.removeItem('cart')
}

function setAddress(details) {
    document.getElementById('address').innerText = details.address + ", " + details.city + ", " + details.country + " - " + details.postalCode;
}

function setDate() {
    const date = new Date();
    const dateString = date.getDate() + " " + monthName[date.getMonth()] + " " + date.getFullYear();
    document.getElementById('date').innerText = dateString
}
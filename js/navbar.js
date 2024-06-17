window.onload = () => { }

function expandNavbar() {
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenu.classList.contains('h-0')) {
        mobileMenu.classList.remove('h-0');
    }

    if (mobileMenu.classList.contains('openNavbar')) {
        mobileMenu.animate({
            height: '0'
        }, {
            delay: 800,
            fill: 'forwards'
        })
        mobileMenu.classList.remove('openNavbar');
        mobileMenu.classList.add('closeNavbar');
    } else {
        mobileMenu.animate({
            height: 'auto'
        }, {
            duration: 500,
            fill: 'forwards'
        })
        mobileMenu.classList.remove('closeNavbar');
        mobileMenu.classList.add('openNavbar');
    }
}

function expandProfile() {
    const profileMenu = document.querySelector('#profileMenu');
    if (profileMenu.classList.contains('openProfile')) {
        profileMenu.classList.remove('openProfile');
        profileMenu.classList.add('closeProfile');
    } else {
        profileMenu.classList.remove('closeProfile');
        profileMenu.classList.add('openProfile');
    }
}

function topFunction() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

window.onscroll = () => {
    const scrollButton = document.getElementById('scrollbtn');
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        scrollButton.style.display = 'block';
    } else {
        scrollButton.style.display = 'none';
    }
}
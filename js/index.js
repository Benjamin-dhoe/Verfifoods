document.addEventListener('DOMContentLoaded', function() {
    // HTML for the language popup
    const popupHtml = `
    <div id="popupLang" class="popupholder">
        <div id="containerLang" class="popupcontainer">
            <div id="closeLang" class="closebtn">X</div>
            <div>
                <div id="langNL" class="langchoice">
                    <img src="/images/Flag-Netherlands.svg" loading="lazy" alt="" class="flag">
                    <div>Nederlands</div>
                </div>
                <div id="langFR" class="langchoice">
                    <img src="/images/Flag-France.svg" loading="lazy" alt="" class="flag">
                    <div>Français</div>
                </div>
                <div id="langEN" class="langchoice">
                    <img src="/images/Flag-Great-Britain.svg" loading="lazy" alt="" class="flag">
                    <div>English</div>
                </div>
            </div>
        </div>
    </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', popupHtml);

    // Language switcher logic
    const url = window.location.href.toLowerCase();
    const langHolderElement = document.querySelector('[langholder]');

    let flagSrc = '/images/Flag-France.svg';
    let langText = 'FR';

    if (url.includes('/nl')) {
        flagSrc = '/images/Flag-Netherlands.svg';
        langText = 'NL';
    } else if (url.includes('/en')) {
        flagSrc = '/images/Flag-Great-Britain.svg';
        langText = 'EN';
    }

    const langHolderHtml = `
    <div id="openLang" class="langholder">
        <img src="${flagSrc}" loading="lazy" alt="" class="flag">
        <div>${langText}</div>
        <div class="rotatedtext">&gt;</div>
    </div>
    `;

    if (langHolderElement) {
        langHolderElement.insertAdjacentHTML('beforeend', langHolderHtml);
    } else {
        document.body.insertAdjacentHTML('beforeend', langHolderHtml);
    }

    const langBtn = document.getElementById('openLang');
    const popupLang = document.getElementById('popupLang');
    const containerLang = document.getElementById('containerLang');
    const closeLang = document.getElementById('closeLang');

    langBtn.addEventListener('click', function() {
        popupLang.style.visibility = "visible";
        popupLang.style.opacity = 1;
        setTimeout(() => {
            containerLang.style.opacity = 1;
        }, 650);
    });

    closeLang.addEventListener('click', function() {
        popupLang.style.opacity = 0;
        popupLang.style.visibility = "hidden";
        containerLang.style.opacity = 0;
    });

    document.getElementById('langNL').addEventListener('click', function() {
        window.location.href = '/nl';
    });

    document.getElementById('langFR').addEventListener('click', function() {
        window.location.href = '/fr';
    });

    document.getElementById('langEN').addEventListener('click', function() {
        window.location.href = '/en';
    });

    // Navbar toggle
    const toggleBtn = document.getElementById('openNavPhone');
    if (toggleBtn) {
        const navLinksHolder = document.querySelector('.navlinksholder');
        let isOpen = false;
        toggleBtn.addEventListener('click', function() {
            const fullHeight = (window.innerHeight - 80) + 'px';
            if (!isOpen) {
                navLinksHolder.style.height = fullHeight;
            } else {
                navLinksHolder.style.height = '0';
            }
            isOpen = !isOpen;
        });
    }

    // Cookie management functions
    function setCookie(name, value, days) {
        let expires = "";
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/";
    }

    function getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    function eraseCookie(name) {
        document.cookie = name + '=; Max-Age=-99999999;';
    }

    // Check for authentication via cookies
    const userId = getCookie('userId');

    if (userId) {
        // User is logged in
        const navConnectLink = document.querySelector('a[href="/se-connecter"]');
        if (navConnectLink) {
            navConnectLink.remove();
        }

        const userNavHtml = `
        <div class="navlink logged w-inline-block">
            <img src="/images/usericon.svg" loading="lazy" alt="" class="loggedicon">
            <div>&gt;</div>
        </div>
        `;
        document.querySelector('.navlinksholder').insertAdjacentHTML('beforeend', userNavHtml);

        const userNav = document.querySelector('.navlink.logged');
        userNav.addEventListener('click', function() {
            window.location.href = `/users/${userId}`;
        });

    } else {
        // User is not logged in, ensure the login link is present
        const existingLoginLink = document.querySelector('a[href="/se-connecter"]');
        if (!existingLoginLink) {
            document.querySelector('.navlinksholder').insertAdjacentHTML('beforeend', `
            <a class="navlink w-inline-block" href="/se-connecter">
                <div>Se connecter</div>
            </a>
            `);
        }
    }
});


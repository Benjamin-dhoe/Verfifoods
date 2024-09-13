document.addEventListener('DOMContentLoaded', function() {
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
    };

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
        window.location.href = urlNL;
    });

    document.getElementById('langFR').addEventListener('click', function() {
        window.location.href = urlFR;
    });

    document.getElementById('langEN').addEventListener('click', function() {
        window.location.href = urlEN;
    });

    //navbar
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
});
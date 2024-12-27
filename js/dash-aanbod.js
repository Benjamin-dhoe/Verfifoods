document.querySelectorAll('[opensidemenu]').forEach(function(element) {
    element.addEventListener('click', function() {
      document.querySelector('.holderappdashboard').style.display = 'none';
      document.querySelector('.holderlinksdashboard').style.display = 'block';
    });
  });

document.querySelectorAll('[closesidemenu]').forEach(function(element) {
    element.addEventListener('click', function() {
         document.querySelector('.holderlinksdashboard').style.display = 'none';
        document.querySelector('.holderappdashboard').style.display = 'block';
    });
  });

document.querySelectorAll('[openproducts]').forEach(element => {
    element.addEventListener('click', () => {
      const openProductsValue = element.getAttribute('openproducts');
      
      const targetElement = document.querySelector(`[products="${openProductsValue}"]`);
        
    if (window.innerWidth < 767) {
        document.querySelector('.holderlinksdashboard').style.display = 'none';
        document.querySelector('.holderappdashboard').style.display = 'block';
      }
        
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      } else {
        console.log(`No element found with products="${openProductsValue}"`);
      }
    });
  });

document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
        const TWO_HOURS = 2 * 60 * 60 * 1000;
        const pageKey = "pageLoadTimestamp";
        const now = Date.now();
        const lastLoad = localStorage.getItem(pageKey);

        if (lastLoad) {
            const elapsed = now - parseInt(lastLoad, 10);
            if (elapsed > TWO_HOURS) {
                localStorage.setItem(pageKey, now);
                window.location.reload();
            }
        } else {
            localStorage.setItem(pageKey, now);
        }
    }
});

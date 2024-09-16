document.querySelectorAll('[opensidemenu]').forEach(function(element) {
    element.addEventListener('click', function() {
      document.querySelector('.holderappdashboard').forEach(function(el) {
        el.style.display = 'none';
      });

      document.querySelector('.holderlinksdashboard').forEach(function(el) {
        el.style.display = 'block';
      });
    });
  });

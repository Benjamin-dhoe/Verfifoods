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

(function () {
  var hamburger = document.querySelector('.nav-hamburger');
  var mobileMenu = document.getElementById('nav-mobile');
  hamburger.addEventListener('click', function () {
    var open = !mobileMenu.classList.contains('is-open');
    mobileMenu.classList.toggle('is-open', open);
    hamburger.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
  mobileMenu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      mobileMenu.classList.remove('is-open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
})();

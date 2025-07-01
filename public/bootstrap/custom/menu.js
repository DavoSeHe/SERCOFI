// Esperamos que el DOM esté cargado
document.addEventListener('DOMContentLoaded', function () {
  window.addEventListener('scroll', function () {
    const navbar = document.querySelector('.my-navbar');

    if (window.scrollY > 50) {
      navbar.classList.add('shrink');
    } else {
      navbar.classList.remove('shrink');
    }
  });
});
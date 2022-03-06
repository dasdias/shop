'use strict';

document.addEventListener('DOMContentLoaded', function () {
  var menuCover = document.querySelector('.menu-cover');
  var headerBurger = document.querySelector('.header-burger');
  var menuClose = document.querySelector('.menu__close');

  var openMenu = function openMenu() {
    menuCover.classList.toggle('menu-cover-hidden');
  };

  var closeMenu = function closeMenu() {
    menuCover.classList.add('menu-cover-hidden');
  };

  headerBurger.addEventListener('click', openMenu);
  menuClose.addEventListener('click', closeMenu);
  menuCover.addEventListener('click', function (e) {
    var target = e.target;

    if (target.className === 'menu-cover') {
      closeMenu();
    }
  });
});
//# sourceMappingURL=all.js.map

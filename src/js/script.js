'use strict';
document.addEventListener('DOMContentLoaded', function () {
    const menuCover = document.querySelector('.menu-cover');
    const headerBurger = document.querySelector('.header-burger');
    const menuClose = document.querySelector('.menu__close');

    const openMenu = () => {
        menuCover.classList.toggle('menu-cover-hidden');
    }
    const closeMenu = () => {
        menuCover.classList.add('menu-cover-hidden');
    }

    headerBurger.addEventListener('click', openMenu);
    menuClose.addEventListener('click', closeMenu);
    menuCover.addEventListener('click', (e) => {
        let target = e.target;
        if (target.className === 'menu-cover') {
            closeMenu();
        }       
    });
});
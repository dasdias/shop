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


	const filterCategorys = document.querySelectorAll('.filter-category__title');

	function tabs(currentElem) {
		filterCategorys.forEach(elem => {
			elem.nextElementSibling.classList.remove('filter-category__group--active');
		});
		currentElem.classList.add('filter-category__group--active');
	}

	filterCategorys.forEach(element => {
		element.addEventListener('click', (e) => {
			const target = e.target;
			console.log(target.nextElementSibling);
			const nextElem = target.nextElementSibling;
			tabs(nextElem);
			// nextElem.classList.toggle('filter-category__group--active');
			// console.log(nextElem.clientHeight); 
		});
	});
});
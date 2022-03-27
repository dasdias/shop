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

// filter
	const filterCategorys = document.querySelectorAll('.filter-category__title');
	const filterWrapHeader = document.querySelector('.filter-wrap__header');
	const filterCategory = document.querySelector('.filter-category');
	const body = document.querySelector('body');

	function tabs(currentElem) {
		filterCategorys.forEach(elem => {
			elem.nextElementSibling.classList.remove('filter-category__group--active');
		});
		currentElem.classList.add('filter-category__group--active');
	}

	filterCategorys.forEach(element => {
		element.addEventListener('click', (e) => {
			const target = e.target;
			const nextElem = target.nextElementSibling;
			tabs(nextElem);
		});
	});

	body.addEventListener('click', (e) => {
		const target = e.target;
		if (filterCategory) {
			if (target.closest('.filter-wrap__header')) {
				filterCategory.classList.toggle('filter-category--active');
				filterWrapHeader.classList.toggle('filter-wrap__header--active');
			}
		}
		if (filterCategory) {
			if (!target.closest('.filter-wrap') || target.closest('.filter-category__link')) {
				filterCategory.classList.remove('filter-category--active');
				filterWrapHeader.classList.remove('filter-wrap__header--active');
			}
		} 

	});
});
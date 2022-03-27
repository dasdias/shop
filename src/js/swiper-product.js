"use strict";
// swiper-product
document.addEventListener('DOMContentLoaded', () => {
    if ( typeof Swiper === 'function') {
        const productSlider = new Swiper('.product-slider', {
            // Optional parameters
            // direction: 'vertical',
            loop: true,

            // If we need pagination
            pagination: {
                el: '.swiper-pagination',
            },

            // Navigation arrows
            navigation: {
                nextEl: '.product-slider-next',
                prevEl: '.product-slider-prev',
            },

            // And if we need scrollbar
            scrollbar: {
                el: '.swiper-scrollbar',
            },
        });
    } 
});
// End swiper-product
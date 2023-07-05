var productSlideshowContainer = document.querySelector('.product-slideshow');
var thumbnailSlideshowContainer = document.querySelector('.product-thumbnail-slideshow');

if (productSlideshowContainer) {
  var productSlideshow = new Splide( '.product-slideshow'  , {
    rewind: true,
    type: 'fade',
    keyboard: true,
    lazyLoad: 'sequential',
    arrows: thumbnailSlideshowContainer ? true : false,
    pagination: thumbnailSlideshowContainer ? true : false,
  });
  if (thumbnailSlideshowContainer) {
    var thumbnailSlideshow = new Splide( '.product-thumbnail-slideshow'  , {
      fixedWidth  : '12%',
      fixedHeight : '12%',
      gap         : 10,
      rewind      : true,
      pagination  : false,
      isNavigation: true,
      breakpoints : {
        1600: {
          fixedWidth : '15%',
          fixedHeight: '15%',
        },
        1200: {
          fixedWidth : '20%',
          fixedHeight: '20%',
        },
        600: {
          fixedWidth : '20%',
          fixedHeight: '20%',
        },
      },
      arrows: false,
      lazyLoad: 'sequential',
    });
    productSlideshow.sync( thumbnailSlideshow );
    productSlideshow.mount();
    thumbnailSlideshow.mount();
  }
  else {
    productSlideshow.mount();
  }
}
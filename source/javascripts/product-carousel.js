var productSlideshowContainer = document.querySelector('.product-slideshow');
var thumbnailSlideshowContainer = document.querySelector('.product-thumbnail-slideshow');

if (productSlideshowContainer) {
  var productSlideshow = new Splide( '.product-slideshow'  , {
    rewind: true,
    type: 'fade',
    arrows: thumbnailSlideshowContainer ? true : false,
    pagination: thumbnailSlideshowContainer ? true : false,
  });
  if (thumbnailSlideshowContainer) {
    var thumbnailSlideshow = new Splide( '.product-thumbnail-slideshow'  , {
      fixedWidth  : 100,
      fixedHeight : 100,
      gap         : 10,
      rewind      : true,
      pagination  : false,
      isNavigation: true,
      breakpoints : {
        600: {
          fixedWidth : 64,
          fixedHeight: 64,
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
var productSlideshowContainer = document.querySelector('.product-carousel');
var thumbnailSlideshowContainer = document.querySelector('.product-thumbnail-carousel');

if (productSlideshowContainer) {
  var productSlideshow = new Splide( '.product-carousel'  , {
    rewind: true,
    keyboard: true,
    arrows: thumbnailSlideshowContainer ? true : false,
    pagination: thumbnailSlideshowContainer ? true : false,
  });
  if (thumbnailSlideshowContainer) {
    var thumbnailSlideshow = new Splide( '.product-thumbnail-carousel'  , {
      fixedWidth  : '12%',
      fixedHeight : '12%',
      gap         : 16,
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
    });
    productSlideshow.sync( thumbnailSlideshow );
    productSlideshow.mount();
    thumbnailSlideshow.mount();
  }
  else {
    productSlideshow.mount();
  }
}
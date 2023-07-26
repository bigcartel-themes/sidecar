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
      breakpoints: {
        768: {
          fixedWidth: '16%',
          fixedHeight: '16%',
        }
      },
      gap: '12px',
      rewind      : true,
      pagination  : false,
      updateOnMove: true,
      drag: 'free',
      isNavigation: true,
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
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
      fixedWidth  : '10%',
      fixedHeight : '10%',
      gap: '0',
      rewind      : true,
      pagination  : false,
      focus: 'center',
      updateOnMove: true,
      drag: 'free',
      isNavigation: true,
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
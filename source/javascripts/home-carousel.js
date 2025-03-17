const homeSlideshowContainer = document.querySelector('.home-slideshow');
if (homeSlideshowContainer) {
  document.addEventListener( 'DOMContentLoaded', function() {
    var splide = new Splide( '.home-slideshow', {
      arrows: false,
      type: 'slide',
      autoplay: themeOptions.homepageSlideshowAutoplay,
      interval: themeOptions.homepageSlideshowSpeed,
      speed: 1500,
      rewind: true,
      keyboard: true,
      pagination: true
    } );
    splide.mount();
  });
}
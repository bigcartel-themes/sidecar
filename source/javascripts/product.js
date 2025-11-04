const productForm = document.querySelector('.product-form');
const addToCartButton = document.querySelector('.add-to-cart-button');
const addToCartButtonText = addToCartButton?.querySelector('.button-text');
const addedText = addToCartButton?.dataset.addedText;
const addText = addToCartButton?.dataset.addTitle;
let resetTimer = null;

productForm?.addEventListener('submit', function(e) {
  const itemID = document.querySelector("#option").value;
  const quantity = document.querySelector('#product-quantity').value;

  e.preventDefault();
  if (!addToCartButton.classList.contains('adding')) {
    if (quantity > 0 && itemID > 0) {
      // Clear any pending reset timer from previous click
      if (resetTimer) {
        clearTimeout(resetTimer);
        resetTimer = null;
      }

      addToCartButton.classList.add('adding');
      addToCartButton.blur();
      Cart.addItem(itemID, quantity, (cart) => {
        setTimeout(() => {
          if (cart.total) {
            addToCartButtonText.innerHTML = addedText;
            addToCartButton.classList.remove('adding');
            updateCartCounts(cart);
            document.querySelector('.product-form-cart-linker').classList.add('added');
            resetProductForm();
          }
          else {
            addToCartButton.classList.remove('adding');
            alert('Sorry, an error occurred. Please try again.');
            resetProductForm();
          }
        }, 300);
      });
    }
  }
});

function resetProductForm() {
  resetTimer = setTimeout(() => {
    addToCartButtonText.innerHTML = addText;
    resetTimer = null;
  }, 1500);
}
if (themeOptions.productImageZoom === true) {
  let carouselImages = document.querySelector('.splide__list');
  let galleryElement = '.product-images';
  let galleryChildren = '.gallery-link';
  if (carouselImages) {
    galleryElement = '.splide__list';
    galleryChildren = '.splide__slide:not(.splide__slide--clone) a'
  }
  var lightbox = new PhotoSwipeLightbox({
    gallery: galleryElement,
    children: galleryChildren,
    loop: true,
    showHideAnimationType: 'fade',
    paddingFn: (viewportSize) => {
      let paddingVal = 100;
      if (viewportSize.x < 768) {
        paddingVal = 16;
      }
      return {
        top: paddingVal,
        bottom: paddingVal,
        left: paddingVal,
        right: paddingVal
      };
    },
    bgOpacity: 1,
    pswpModule: PhotoSwipe
  });
  lightbox.init();
}

document.addEventListener('DOMContentLoaded', () => {
  const isProductPage = document.body.getAttribute('data-bc-page-type') === 'product';
  if (isProductPage) {
    updateInventoryMessage();
    
    const price = window.bigcartel?.product?.default_price || null;    
    showBnplMessaging(price, { alignment: 'left', displayMode: 'grid', pageType: 'product' });
  }
});
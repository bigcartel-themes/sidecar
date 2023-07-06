const productForm = document.querySelector('.product-form');
const addToCartButton = document.querySelector('.add-to-cart-button');
const addToCartButtonText = addToCartButton?.querySelector('.button-text');
const addedText = addToCartButton?.dataset.addedText;
let addText = '';
productForm?.addEventListener('submit', function(e) {
  const itemID = document.querySelector("#option").value;
  const quantity = document.querySelector('#product-quantity').value;
  addText = addToCartButtonText?.innerHTML;

  e.preventDefault();
  if (!addToCartButton.classList.contains('adding')) {
    if (quantity > 0 && itemID > 0) {
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
        }, 600);
      });
    }
  }
});

function resetProductForm() {
  setTimeout(() => {
    addToCartButtonText.innerHTML = addText;
  }, 1500);
}
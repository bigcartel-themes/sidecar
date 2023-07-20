const cartForm = document.querySelector('.cart-form');
const qtyButtons = document.querySelectorAll('.qty-button');
const qtyInputs = document.querySelectorAll('.product-quantity');
const removeButtons = document.querySelectorAll('.cart-remove-item');
removeButtons?.forEach((removeButton) => {
  removeButton.addEventListener('click', (event) => {
    const item_id = parseInt(event.currentTarget.dataset.itemId);
    const new_value = 0;
    if (item_id > 0) {
      Cart.removeItem(item_id, (cart) => {
        processUpdate('', item_id, new_value, cart);
      });
    }
  })
})
qtyInputs?.forEach((qtyInput) => {
  qtyInput.addEventListener('change', (event) => {
    const input = event.target;
    const item_id = parseInt(input.dataset.itemId);
    const new_value = parseInt(input.value);
    if (item_id > 0) {
      Cart.updateItem(item_id, new_value, (cart) => {
        processUpdate(input, item_id, new_value, cart);
      });
    }
  })
  qtyInput.addEventListener('keydown', (event) => {
    if (event.keyCode == 13) {
      event.preventDefault();
      const item_id = parseInt(event.target.dataset.itemId);
      const new_value = parseInt(event.target.value);
      const input = event.target;
      if (item_id > 0) {
        Cart.updateItem(item_id, new_value, (cart) => {
          processUpdate(input, item_id, new_value, cart);
        });
      }
    }
  })
})

qtyButtons?.forEach((qtyButton) => {
  qtyButton.addEventListener('click', (event) => {
    const button = event.currentTarget;
    const item_id = parseInt(button.dataset.itemId);
    const input = document.querySelector(".product-quantity[data-item-id='" + item_id + "']");
    const current_val = input ? parseInt(input.value) : 0;
    let new_value = 0;
    if (item_id > 0) {
      if (button.dataset.func == "decrease") {
        new_value = current_val - 1;
      }
      if (button.dataset.func == "increase") {
        new_value = current_val + 1;
      }
      Cart.updateItem(item_id, new_value, (cart) => {
        processUpdate(input, item_id, new_value, cart);
      });
    }
  })
})

updateCartCounts = (cart) => {
  const sub_total = Format.money(cart.total, true, true);
  const item_count = cart.item_count;
  const itemOrItems = Format.pluralize(item_count, 'item', 'items');

  const cartCountElements = document.querySelectorAll('.cart-count');
  const cartCountWithTotal = document.querySelector('.cart-details');

  const cartTotal = document.querySelector('.cart-total');
  const cartSubtotal = document.querySelector('.cart-subtotal__amount');

  cartCountElements.forEach((element) => {
    htmlHighlight(element,item_count)
  });

  if (cartCountWithTotal) { htmlHighlight(cartCountWithTotal, `${itemOrItems}: ${sub_total}`); }
  if (cartTotal) { htmlHighlight(cartTotal, sub_total); }
  if (cartSubtotal) { htmlHighlight(cartSubtotal, sub_total); }

}

processUpdate = (input, item_id, new_val, cart) => {
  if (cart.item_count == 0) {
    location.reload();
    return false;
  }

  document.querySelector('.errors')?.remove();

  if (input) {
    input.value = new_val;
  }
  updateCartCounts(cart);
  if (new_val > 0) {
    for (itemIndex = 0; itemIndex < cart.items.length; itemIndex++) {
      if (cart.items[itemIndex].id == item_id) {
        item_price = cart.items[itemIndex].price;
        formatted_item_price = Format.money(item_price, true, true);
        let priceElement = document.querySelector('.cart-item-price__update[data-item-id="'+item_id+'"]');
        htmlHighlight(priceElement,formatted_item_price);
      }
    }
  }
  else {
    document.querySelector('.cart-item[data-item-id="'+item_id+'"]').remove();
  }
}
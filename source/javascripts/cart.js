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

const shouldUseWebShare = () => {
  const hasShareApi = 'share' in navigator;
  
  const isMobileUserAgentData = 'userAgentData' in navigator && navigator.userAgentData.mobile;
  const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent) || 
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isAndroid = /Android/i.test(navigator.userAgent);
  
  return hasShareApi && (isMobileUserAgentData || isIOS || isAndroid);
};

document.querySelector('.copy-cart-link')?.addEventListener('click', async (event) => {
  event.preventDefault();
  const link = event.currentTarget;
  const originalText = link.textContent;
  const text = link.dataset.clipboardText;

  if (shouldUseWebShare()) {
    try {
      await navigator.share({
        title: 'Check out this cart I saved',
        url: text
      });
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.warn('Share failed:', error);
      }
    }
  } else {
    try {
      await navigator.clipboard.writeText(text);
      link.textContent = 'Link copied!';
      setTimeout(() => {
        link.textContent = originalText;
      }, 2000);
    } catch (error) {
      console.warn('Clipboard copy failed:', error);
    }
  }
});

function updateShareableLink() {
  fetch('/cart/shareable_link.json')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      if (!data?.shareable_link) {
        throw new Error('Invalid response format');
      }
      const linkElement = document.querySelector('.copy-cart-link');
      if (linkElement) {
        linkElement.href = data.shareable_link;
        linkElement.dataset.clipboardText = data.shareable_link;
      }
    })
    .catch(error => {
      console.warn('Failed to update shareable cart link:', error);
      const linkElement = document.querySelector('.copy-cart-link');
      if (linkElement) {
        linkElement.style.display = 'none';
      }
    });
}

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

  updateShareableLink();

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
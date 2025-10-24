var isGreaterThanZero = function(currentValue) {
  return currentValue > 0;
}

function arrayContainsArray(superset, subset) {
  if (0 === subset.length) {
    return false;
  }
  return subset.every(function (value) {
    return (superset.indexOf(value) >= 0);
  });
}

function unique(item, index, array) {
  return array.indexOf(item) == index;
}

function cartesianProduct(a) {
  var i, j, l, m, a1, o = [];
  if (!a || a.length == 0) return a;
  a1 = a.splice(0, 1)[0];
  a = cartesianProduct(a);
  for (i = 0, l = a1.length; i < l; i++) {
    if (a && a.length) for (j = 0, m = a.length; j < m; j++)
      o.push([a1[i]].concat(a[j]));
    else
      o.push([a1[i]]);
  }
  return o;
}

Array.prototype.equals = function (array) {
  if (!array)
    return false;
  if (this.length != array.length)
    return false;
  for (var i = 0, l=this.length; i < l; i++) {
    if (this[i] instanceof Array && array[i] instanceof Array) {
      if (!this[i].equals(array[i]))
        return false;
    }
    else if (this[i] != array[i]) {
      return false;
    }
  }
  return true;
}

// From https://github.com/kevlatus/polyfill-array-includes/blob/master/array-includes.js
if (!Array.prototype.includes) {
  Object.defineProperty(Array.prototype, 'includes', {
    value: function (searchElement, fromIndex) {
      if (this == null) {
        throw new TypeError('"this" is null or not defined');
      }
      var o = Object(this);
      var len = o.length >>> 0;
      if (len === 0) {
        return false;
      }
      var n = fromIndex | 0;
      var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);
      function sameValueZero(x, y) {
        return x === y || (typeof x === 'number' && typeof y === 'number' && isNaN(x) && isNaN(y));
      }
      while (k < len) {
        if (sameValueZero(o[k], searchElement)) {
          return true;
        }
        k++;
      }
      return false;
    }
  });
}

Array.prototype.count = function (filterMethod) {
  return this.reduce(function (count, item) {
    return filterMethod(item) ? count + 1 : count;
  }, 0);
};

$('.product_option_select').on('change',function() {
  var option_price = $(this).find("option:selected").attr("data-price");
  enableAddButton(option_price);
});
function enableAddButton(updated_price) {
  var addButton = $('.add-to-cart-button');
  var addButtonTitle = addButton.attr('data-add-title');
  addButton.attr("disabled",false);
  if (updated_price) {
    priceTitle = ' - ' + formatMoney(updated_price, true, true);
  }
  else {
    priceTitle = '';
  }
  addButton.find('.button-text').html(addButtonTitle + priceTitle);
  updateInventoryMessage($('#option').val());
  showBnplMessaging(updated_price, { alignment: 'left', displayMode: 'grid', pageType: 'product' });
}

function disableAddButton(type) {
  var addButton = $('.add-to-cart-button');
  var addButtonTitle = addButton.attr('data-add-title');
  if (type == "sold-out") {
    var addButtonTitle = addButton.attr('data-sold-title');
  }
  if (!addButton.is(":disabled")) {
    addButton.attr("disabled","disabled");
  }
  addButton.find('.button-text').html(addButtonTitle);
}

function enableSelectOption(select_option) {
  select_option.removeAttr("disabled");
  select_option.text(select_option.attr("data-name"));
  select_option.removeAttr("disabled-type");
  if ((select_option.parent().is('span'))) {
    select_option.unwrap();
  }
}
function disableSelectOption(select_option, type) {
  if (type === "sold-out") {
    disabled_text = select_option.parent().attr("data-sold-text");
    disabled_type = "sold-out";
    if (show_sold_out_product_options === 'false') {
      hide_option = true;
    }
    else {
      hide_option = false;
    }
  }
  if (type === "unavailable") {
    disabled_text = select_option.parent().attr("data-unavailable-text");
    disabled_type = "unavailable";
    hide_option = true;
  }
  if (select_option.val() > 0) {
    var name = select_option.attr("data-name");
    select_option.attr("disabled",true);
    select_option.text(name + ' ' + disabled_text);
    select_option.attr("disabled-type",disabled_type);
    if (hide_option === true) {
      if (!(select_option.parent().is('span'))) {
        select_option.wrap('<span>');
      }
    }
  }
}

function processProduct(product) {
  window.bigcartel = window.bigcartel || {};
  window.bigcartel.product = product;
  if (product.has_option_groups) {
    setInitialProductOptionStatuses(product);
    $(".product_option_group").on('change',function() {
      $('#option').val(0);
      processAvailableDropdownOptions(product, $(this));
    });
    if ($('#option').val() > 0) {
      enableAddButton();
    }
  }
  updateInventoryMessage();
  if ($('.product_option_select').length) {
    if (show_sold_out_product_options === 'false') {
      $('option[disabled-type="sold-out"]').wrap('<span>');
    }
  }
  $('.reset-selection-button').on('click', function() {
    enableAddButton();
    $('.reset-selection-button-container').fadeOut('fast');
    $(".product_option_group option").each(function(index,element) {
      if (element.value > 0) {
        enableSelectOption($(element));
      }
    });
    setInitialProductOptionStatuses(product);
  })
}
function createCartesianProductOptions(product) {
  product_option_groups = [];
  for (ogIndex = 0; ogIndex < product.option_groups.length; ogIndex++) {
    product_option_group_group_values = [];
    for (ogvIndex = 0; ogvIndex < product.option_groups[ogIndex].values.length; ogvIndex++) {
      product_option_group_group_values.push(product.option_groups[ogIndex].values[ogvIndex].id);
    }
    product_option_groups.push(product_option_group_group_values);
  }
  var cartesian_options = cartesianProduct(product_option_groups);
  return cartesian_options;
}

function setInitialProductOptionStatuses(product) {
  product_option_group_values = [];
  for (ogIndex = 0; ogIndex < product.option_groups.length; ogIndex++) {
    for (ogvIndex = 0; ogvIndex < product.option_groups[ogIndex].values.length; ogvIndex++) {
      product_option_group_values.push(product.option_groups[ogIndex].values[ogvIndex].id);
    }
  }
  cartesian_options = createCartesianProductOptions(product);
  for (pogv = 0; pogv < product_option_group_values.length; pogv++) {
    var option_group_value_id = product_option_group_values[pogv];
    var product_iterator = 0;
    var num_sold_out = 0;
    var num_options = 0;
    for (co = 0; co < cartesian_options.length; co++) {
      if (cartesian_options[co].includes(option_group_value_id)) {
        product_option = findProductOptionByValueArray(product.options, cartesian_options[co]);
        if (product_option) {
          num_options++;
          if (product_option.sold_out) {
            num_sold_out++;
          }
        }
        product_iterator++;
      }
    }
    dropdown_select = $(".product_option_group option[value='" + option_group_value_id + "']");
    if (num_options === 0 || product_iterator === num_sold_out || num_options === num_sold_out) {
      if (num_options === 0) {
        disable_type = "unavailable";
      }
      if (product_iterator === num_sold_out || num_options === num_sold_out) {
        disable_type = "sold-out";
      }
      disableSelectOption(dropdown_select,disable_type);
    }
  }
}

function processAvailableDropdownOptions(product, changed_dropdown) {
  selected_values = getSelectedValues();
  num_selected = selected_values.count(function (item) {
    return item > 0;
  });
  allSelected = selected_values.every(isGreaterThanZero);
  num_option_groups = product.option_groups.length;
  changed_value = parseInt(changed_dropdown.val());
  selected_value = [];
  selected_value.push(changed_value);
  this_group_id = changed_dropdown.attr("data-group-id");
  $(".product_option_group").not(changed_dropdown).find('option').each(function(index,element) {
    if (element.value > 0) {
      enableSelectOption($(element));
    }
  });
  cartesian_options = createCartesianProductOptions(product);

  if (num_selected === 1 && num_option_groups > 1) {
    for (ogIndex = 0; ogIndex < product.option_groups.length; ogIndex++) {
      var option_group = product.option_groups[ogIndex];
      if (option_group.id != this_group_id) {
        for (ogvIndex = 0; ogvIndex < option_group.values.length; ogvIndex++) {
          var option_group_value = option_group.values[ogvIndex];
          option_group_value_array = [];
          option_group_value_array.push(changed_value);
          option_group_value_array.push(parseInt(option_group_value.id));
          var product_iterator = 0;
          var num_sold_out = 0;
          var num_options = 0;
          for (co = 0; co < cartesian_options.length; co++) {
            if (arrayContainsArray(cartesian_options[co], option_group_value_array)) {
              product_option = findProductOptionByValueArray(product.options, cartesian_options[co]);
              if (product_option) {
                num_options++;
                if (product_option.sold_out) {
                  num_sold_out++;
                }
              }
              product_iterator++;
            }
          }
          dropdown_select = $(".product_option_group option[value='" + option_group_value.id + "']");
          if (num_options === 0 || product_iterator === num_sold_out || num_options === num_sold_out) {
            if (num_options === 0) {
              disable_type = "unavailable";
            }
            if (product_iterator === num_sold_out || num_options === num_sold_out) {
              disable_type = "sold-out";
            }
            disableSelectOption(dropdown_select,disable_type);
          }
        }
      }
    }
  }
  if (num_selected === 2 && num_option_groups === 3) {
    $(".product_option_group").each(function(i, object) {
      if (object.value == 0) {
        unselected_group_id = parseInt($(object).attr("data-group-id"));
      }
    });
    for (ogIndex = 0; ogIndex < product.option_groups.length; ogIndex++) {
      option_group = product.option_groups[ogIndex];
      if (option_group.id != this_group_id) {
        for (ogvIndex = 0; ogvIndex < option_group.values.length; ogvIndex++) {
          option_group_value = option_group.values[ogvIndex];
          option_group_value_array = [];
          option_group_value_array.push(changed_value);
          option_group_value_array.push(parseInt(option_group_value.id));
          var product_iterator = 0;
          var num_sold_out = 0;
          var num_options = 0;
          for (co = 0; co < cartesian_options.length; co++) {
            if (arrayContainsArray(cartesian_options[co], option_group_value_array)) {
              product_option = findProductOptionByValueArray(product.options, cartesian_options[co]);
              if (product_option) {
                num_options++;
                if (product_option.sold_out) {
                  num_sold_out++;
                }
              }
              product_iterator++;
            }
          }
          if (option_group.id === unselected_group_id) {
            option_group_value_array = [];
            option_group_value_array.push(parseInt(option_group_value.id));
            for (svIndex = 0; svIndex < selected_values.length; svIndex++) {
              if (selected_values[svIndex] > 0) {
                option_group_value_array.push(selected_values[svIndex]);
              }
            }
            product_option = findProductOptionByValueArray(product.options, option_group_value_array);
            dropdown_select = $(".product_option_group option[value='" + option_group_value.id + "']");
            if (product_option) {
              if (product_option.sold_out) {
                disableSelectOption(dropdown_select,"sold-out");
              }
            }
            else {
              disableSelectOption(dropdown_select,"unavailable");
            }
          }
          dropdown_select = $(".product_option_group option[value='" + option_group_value.id + "']");
          if (num_options === 0 || product_iterator === num_sold_out || num_options === num_sold_out) {
            if (num_options === 0) {
              disable_type = "unavailable";
            }
            if (product_iterator === num_sold_out || num_options === num_sold_out) {
              disable_type = "sold-out";
            }
            disableSelectOption(dropdown_select,disable_type);
          }
        }
      }
    }
  }
  if (num_selected > 1 && allSelected) {
    $(".product_option_group").not(changed_dropdown).each(function(index, dropdown) {
      dropdown = $(dropdown);
      dropdown.find('option').each(function(idx, option) {
        is_selected = $(option).is(":selected");
        if (!is_selected) {
          if (option.value > 0) {
            option_group_value_array = [];
            option_group_value_array.push(parseInt(option.value));
            $(".product_option_group").not(dropdown).each(function(index, secondary_dropdown) {
              option_group_value_array.push(parseInt(secondary_dropdown.value));
            });
            product_option = findProductOptionByValueArray(product.options, option_group_value_array);
            for (i = 0; i < option_group_value_array.length; i++) {
              dropdown_select = $(".product_option_group option[value='" + option_group_value_array[i] + "']").not(":selected");
              if (dropdown_select) {
                if (product_option) {
                  if (product_option.sold_out) {
                    disableSelectOption(dropdown_select,"sold-out");
                  }
                  else {
                    enableSelectOption(dropdown_select);
                  }
                }
                else {
                  disableSelectOption(dropdown_select,"unavailable");
                }
              }
            }
          }
        }
      });
    });
  }
  if (allSelected) {
    product_option = findProductOptionByValueArray(product.options, selected_values);
    if (product_option) {
      if (!product_option.sold_out && product_option.id > 0) {
        $('#option').val(product_option.id);
        enableAddButton(product_option.price);
        if (num_option_groups > 1) {
          $('.reset-selection-button-container').fadeIn('fast');
        }
      }
      else {
        disableAddButton("sold-out");
      }
    }
    else {
      disableAddButton("sold-out");
    }
  }
}

function findProductOptionByValueArray(product_options, value_array) {
  for (var productOptionsIndex = 0; productOptionsIndex < product_options.length; productOptionsIndex ++) {
    option_group_values = product_options[productOptionsIndex].option_group_values;
    option_ids = [];
    option_group_values.forEach(function(option_group_value) {
      option_ids.push(option_group_value.id);
    });
    if (arrayContainsArray(option_ids, value_array)) {
      return product_options[productOptionsIndex];
    }
  };
}

function getSelectedValues() {
  selected_values = [];
  $(".product_option_group").each(function(i, object) {
    selected_values.push(parseInt(object.value));
  });
  return selected_values;
};

function updateInventoryMessage(optionId = null) {
  const product = window.bigcartel?.product;
  const messageElement = document.querySelector('[data-inventory-message]');

  if (
    !themeOptions?.showLowInventoryMessages ||
    themeOptions.showInventoryBars ||
    !messageElement ||
    !product
  ) {
    return;
  }

  messageElement.textContent = '';
  const productOptions = product?.options || [];

  // If no option is selected (initial page load or reset) or product has no options
  if (!optionId) {
    const hasOptionWithStatus = (status) => 
      productOptions.length > 0 && 
      productOptions.some(option => 
        option && 
        !option.sold_out && 
        option[status]
      );

    // Single option product - check both statuses
    if (productOptions.length === 1) {
      const option = productOptions[0];
      if (option && !option.sold_out) {
        if (option.isAlmostSoldOut) {
          messageElement.textContent = themeOptions.almostSoldOutMessage;
          messageElement.style.display = 'block';
        } else if (option.isLowInventory) {
          messageElement.textContent = themeOptions.lowInventoryMessage;
          messageElement.style.display = 'block';
        }
      }
      return;
    }

    // Multiple options - only check for low inventory across all options
    if (productOptions.length > 1 && hasOptionWithStatus('isLowInventory')) {
      messageElement.textContent = themeOptions.lowInventoryMessage;
      messageElement.style.display = 'block';
    }
    return;
  }

  // Handle selected option
  const selectedOption = product.options.find(option => option.id === parseInt(optionId));
  if (!selectedOption || selectedOption.sold_out) return;

  // For selected options:
  // - Single option products: check both almost sold out and low inventory
  // - Multiple option products: check both statuses when specific option selected
  if (selectedOption.isAlmostSoldOut) {
    messageElement.textContent = themeOptions.almostSoldOutMessage;
  } else if (selectedOption.isLowInventory) {
    messageElement.textContent = themeOptions.lowInventoryMessage;
  }
}
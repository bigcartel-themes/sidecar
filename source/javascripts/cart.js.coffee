Store.cart = window.Store.cart =
  init: (_super) ->
    @super = _super
    @form = $('#cart_form')
    @timer = null

    @form.find('input, select').each @setDefaultVal
    @form.on 'keyup change', '[name*="cart[update]"], [name="cart[discount_code]"], [name="cart[shipping_country_id]"]', ($.proxy @handleItemUpdate, @)
    @form.on 'click', 'a.remove', ($.proxy @handleItemRemove, @)

  setDefaultVal: ->
    elm = $(@)
    elm.data 'defaultVal', elm.val()

  handleItemRemove: (e) ->
    e.preventDefault()

    @super.clearErrors()
    @super.working()

    link = $(e.currentTarget)
    link.addClass 'loading'

    Cart.removeItem(link.data('item-id'), ($.proxy @updateCart, @))

  handleItemUpdate: (e) ->
    elm = $(e.currentTarget)
    val = elm.val()

    unless val is '' or val is elm.data 'defaultVal'
      clearTimeout @timer
      @timer = setTimeout ($.proxy @processItemUpdate, @, elm, val), 500

  processItemUpdate: (elm, val) ->
    elm.data 'defaultVal', val
    @super.clearErrors()
    @super.working()
    Cart.updateFromForm 'cart_form', ($.proxy @updateCart, @)

  updateCart: (cart) ->
    @super.finished()
    @super.updateCart cart

    if cart.item_count
      @updateItems cart
      @updateDiscount cart
      @updateShipping cart
      @updateTotal cart
    else
      @form.fadeOut 300, ->
        $(@).remove()
        $('.cart_empty').fadeIn 300

  updateItems: (cart) ->
    removed = 0

    $('.cart_item[data-item-id]', @form).each (index) ->
      elm = $(@)
      id = Number(elm.data 'item-id')
      item = cart.items[index - removed]

      if item and id is item.id
        elm.find('.price').htmlHighlight(Format.money item.price, true, true)
      else
        removed++
        elm.slideUp 'fast', ->
          elm.remove()

  updateDiscount: (cart) ->
    if cart.discount
      $('#cart_discount_code').fadeOut 300, -> $(this).remove()
      $('label[for=cart_discount_code]').htmlHighlight cart.discount.name
      $('.discount .value').htmlHighlight(if cart.discount.free_shipping then '' else Format.money(cart.discount.amount, true, true))

  updateShipping: (cart) ->
    if cart.shipping
      $('.cart_shipping_value').toggle(!cart.shipping.pending).htmlHighlight Format.money(cart.shipping.amount, true, true)
      $('#country').toggle cart.shipping.strict

  updateTotal: (cart) ->
    $('.total_price', @form).htmlHighlight(Format.money cart.total, true, true)

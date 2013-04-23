Store.product = window.Store.product =
  messages:
    addToCart: 'Add to Cart'
    addingToCart: 'Adding&hellip;'
    addedToCart: 'Added!'

  init: (_super) ->
    @super = _super
    $('.fancybox').fancybox()
    @setupAddToCart()

  setupAddToCart: ->
    @button = $ 'button.add'
    @form = $ 'form.add'

    @form.on 'submit', $.proxy @addToCart, @

  addToCart: (e) ->
    e.preventDefault()

    if @button.hasClass 'disabled' then return false

    @super.working()
    @super.clearErrors()

    @button.html(@messages.addingToCart).addClass('disabled')

    item = $('[name="cart[add][id]"]').val()
    quantity = $('[name="cart[add][quantity]"]').val()

    Cart.addItem item, quantity, ($.proxy @finishAdding, @)

    return false

  finishAdding: (cart) ->
    @super.finished()
    @super.updateCart(cart)
    @button.html(@messages.addedToCart).removeClass('disabled')

    setTimeout $.proxy(->
      @button.html(@messages.addToCart)
    , @), 3000

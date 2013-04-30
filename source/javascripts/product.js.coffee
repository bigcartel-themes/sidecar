Store.product = window.Store.product =
  messages:
    addToCart: 'Add to Cart'
    addingToCart: 'Adding&hellip;'
    addedToCart: 'Added!'

  init: (_super) ->
    @super = _super
    $('.fancybox').fancybox()
    @setupAddToCart()
    @setupMobileGallery()

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

  setupMobileGallery: ->
    $('.mobile_gallery').on 'click', 'a', $.proxy(@setActiveImage, @)

  setActiveImage: (e) ->
    e.preventDefault()
    elm = $(e.currentTarget)
    img = $("<img src='#{elm.attr('href')}' class='mobile_gallery_viewer'>")
    img.imagesLoaded =>
      $('.mobile_gallery_viewer').replaceWith img
    elm.closest('li').addClass('active').siblings().removeClass('active')

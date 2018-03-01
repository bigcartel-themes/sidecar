Store.product = window.Store.product =

  init: (_super) ->
    @super = _super
    $('.fancybox').fancybox()
    @setupAddToCart()
    @setupMobileGallery()
    
    @addToCartMessage = @super.addToCartMessages.addToCart
    @addingToCartMessage = @super.addToCartMessages.addingToCart
    @addedToCartMessage = @super.addToCartMessages.addedToCart
  
  setupAddToCart: ->
    @button = $ 'button.add'
    @form = $ 'form.add'

    @form.on 'submit', $.proxy @addToCart, @
    $('body').on 'api.error', $.proxy @resolveError, @

  addToCart: (e) ->
    e.preventDefault()

    if @button.hasClass 'disabled' then return false

    @super.working()
    @super.clearErrors()

    @button.html(@addingToCartMessage).addClass('disabled')

    item = $('[name="cart[add][id]"]').val()
    quantity = $('[name="cart[add][quantity]"]').val()

    Cart.addItem item, quantity, ($.proxy @finishAdding, @)

  finishAdding: (cart) ->
    @super.finished()
    @super.updateCart(cart)
    @button.html(@addedToCartMessage).removeClass('disabled')

    setTimeout $.proxy(->
      @button.html(@addToCartMessage)
    , @), 3000

  resolveError: (e) ->
    @button.html(@addToCartMessage).removeClass('disabled')
    @super.finished()

  setupMobileGallery: ->
    $('.mobile_gallery').on 'click', 'a', $.proxy(@setActiveImage, @)

  setActiveImage: (e) ->
    e.preventDefault()
    elm = $(e.currentTarget)
    img = $("<img src='#{elm.attr('href')}' class='mobile_gallery_viewer'>")
    img.imagesLoaded =>
      $('.mobile_gallery_viewer').replaceWith img
      @super.fixHeights()
    elm.closest('li').addClass('active').siblings().removeClass('active')

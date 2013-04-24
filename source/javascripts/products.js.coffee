Store.products = window.Store.products =
  init: (_super) ->
    @super = _super
    @products = $('.products_list')

    @products.imagesLoaded($.proxy @setupProducts, @)
    $(window).smartresize($.proxy @setupProducts, @)

  setupProducts: ->
    setTimeout =>
      @products.isotope @super.isotopeOptions
    , if @super.inPreview then 100 else 0


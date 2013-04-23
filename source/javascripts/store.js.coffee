Store = window.Store =
  init: ->
    page = $('body').attr('id')
    @inPreview = /\/admin\/design/.test top.location.pathname

    @common()
    @[page] and typeof @[page]['init'] is 'function' and @[page]['init'](@)

  common: ->
    $('body').data('search') is true and @setupSearch()
    $(document).ajaxSend(@working).ajaxComplete(@finished)

  setupSearch: ->
    searchForm = $('form.search')

    focus = ->
      searchForm.addClass 'focus'

    blur = ->
      $(this).val ''
      searchForm.removeClass 'focus'

    searchForm.on 'click focus', focus
    searchForm.on 'blur', 'input', blur

  working: ->
    $('body').addClass 'working'

  finished: ->
    $('body').removeClass 'working'

  clearErrors: ->
    console.log 'clearing errors'

  updateCart: (cart) ->
    $('aside .cart .count').htmlHighlight cart.item_count
    $('aside .cart .total').htmlHighlight Format.money(cart.total, true, true)



$ ->
  Store.init()

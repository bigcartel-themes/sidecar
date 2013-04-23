Store = window.Store =
  init: ->
    page = $('body').attr('id')

    @common()
    @[page] and typeof @[page]['init'] is 'function' and @[page]['init']()

  common: ->
    console.log 'SIDECAR TIME!'
    $('.fancybox').fancybox()
    $('body').data('search') is true and @setupSearch()

  setupSearch: ->
    searchForm = $('form.search')

    focus = ->
      searchForm.addClass 'focus'

    blur = ->
      $(this).val ''
      searchForm.removeClass 'focus'

    searchForm.on 'click focus', focus
    searchForm.on 'blur', 'input', blur





$ ->
  Store.init()

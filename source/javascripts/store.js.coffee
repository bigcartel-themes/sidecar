Store = window.Store =
  init: ->
    page = $('body').attr('id')

    @common()
    @[page] and typeof @[page]['init'] is 'function' and @[page]['init']()

  common: ->
    console.log 'SIDECAR TIME!'
    if $('body').data 'search' then @setupSearch()

  setupSearch: ->
    searchForm = $('form[name=search]')

    focus = ->
      searchForm.addClass 'focus'

    blur = ->
      $(this).val ''
      searchForm.removeClass 'focus'

    searchForm.on 'click focus', focus
    searchForm.on 'blur', 'input', blur





$ ->
  Store.init()

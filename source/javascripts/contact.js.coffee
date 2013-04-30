Store.contact = window.Store.contact =
  init: (_super) ->
    @super = _super
    unless @super.inPreview
      $('form.contact input:visible:first').focus()


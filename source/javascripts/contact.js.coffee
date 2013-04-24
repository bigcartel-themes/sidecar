Store.contact = window.Store.contact =
  init: (_super) ->
    @super = _super
    unless @super.inPreview
      console.log $('form.contact input:visible:first').focus()


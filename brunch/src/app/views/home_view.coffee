homeTemplate = require('templates/home')

class exports.HomeView extends Backbone.View
  id: 'home-view'

  initialize: =>
  	@el = $(@el)

  render: ->
   	@el.html homeTemplate()
    _.delay(@setOpacity, 1200)
    @

  setOpacity: =>
  	@$(".backgroundImgDiv").css("opacity", "1")
  	@$(".logoDiv").css("opacity", "1")
  	@$(".bottomDiv").css("opacity", "1")
  	@$(".footer").css("opacity", "1")
  	false
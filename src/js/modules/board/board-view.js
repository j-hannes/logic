var $ = require('jquery')
var Backbone = require('backbone')
Backbone.$ = $
// var _ = require('underscore')

var BoardView = Backbone.View.extend({
  renderToGrid: function(grid) {
    console.log(this.model.toJSON())
  }
})

module.exports = BoardView

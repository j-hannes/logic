var $ = require('jquery')
var Backbone = require('backbone')
Backbone.$ = $
var _ = require('underscore')

var CellView = require('../cell/cell-view')

var BoardView = Backbone.View.extend({
  renderToGrid: function(grid) {
    var horizontalBlocks = this.model.get('rows').horizontal.pluck('blocks')
    var verticalOffset = grid.model.get('verticalOffset')
    _.each(horizontalBlocks, function(values, row) {
      var leftOffset = grid.model.get('horizontalOffset') - values.length;
      _.each(values, function(value, col) {
        grid.placeContent(verticalOffset + row + 1, leftOffset + col + 1,
          this.wrap(value))
      }, this)
    }, this)

    var verticalBlocks = this.model.get('rows').vertical.pluck('blocks')
    var horizontalOffset = grid.model.get('horizontalOffset')
    _.each(verticalBlocks, function(values, col) {
      var topOffset = grid.model.get('verticalOffset') - values.length;
      _.each(values, function(value, row) {
        grid.placeContent(topOffset + row + 1, horizontalOffset + col + 1,
          this.wrap(value))
      }, this)
    }, this)

    var cells = this.model.get('rows').horizontal.pluck('cells')
    _.each(cells, function(cellRow, x) {
      cellRow.each(function(cell, y) {
        var view = new CellView({model: cell})
        grid.placeContent(verticalOffset + 1 + x, horizontalOffset + 1 + y,
                          view.render().el)
      })
    })
  },

  wrap: function(value) {
    return $('<div class="rowValue">').text(value)
  },
})

module.exports = BoardView

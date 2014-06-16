var $ = require('jquery')
var Backbone = require('backbone')
Backbone.$ = $
var _ = require('underscore')

var CellView = require('../cell/cell-view')
var MarkerView = require('../marker/marker-view')
var Block = require('../block/block')
var BlockView = require('../block/block-view')

var BoardView = Backbone.View.extend({
  renderToGrid: function(grid) {
    this.writeHorizontalBlocks(grid)
    this.writeHorizontalBlocksums(grid)
    this.writeVerticalBlocks(grid)
    this.writeVerticalBlocksums(grid)
    this.placeCells(grid)
    this.placeMarkers(grid)
  },

  writeHorizontalBlocks: function(grid) {
    var horizontalBlocks = this.model.get('rows').horizontal.pluck('blocks')
    _.each(horizontalBlocks, function(values, row) {
      var leftOffset = grid.model.get('horizontalOffset') - values.length;
      _.each(values, function(value, col) {
        var block = new Block({value: value})
        var view = new BlockView({model: block})
        grid.placeContent(grid.model.get('verticalOffset') + row + 1,
                          leftOffset + col + 1, view.render().el)
      }, this)
    }, this)
  },

  writeVerticalBlocks: function(grid) {
    var verticalBlocks = this.model.get('rows').vertical.pluck('blocks')
    _.each(verticalBlocks, function(values, col) {
      var topOffset = grid.model.get('verticalOffset') - values.length;
      _.each(values, function(value, row) {
        var block = new Block({value: value})
        var view = new BlockView({model: block})
        grid.placeContent(topOffset + row + 1,
                          grid.model.get('horizontalOffset') + col + 1,
                          view.render().el)
      }, this)
    }, this)
  },

  placeCells: function(grid) {
    var cells = this.model.get('rows').horizontal.pluck('cells')
    _.each(cells, function(cellRow, x) {
      cellRow.each(function(cell, y) {
        var view = new CellView({model: cell})
        grid.placeContent(grid.model.get('verticalOffset') + 1 + x,
                          grid.model.get('horizontalOffset') + 1 + y,
                          view.render().el)
      })
    })
  },

  placeMarkers: function(grid) {
    var horizontal = this.model.get('rows').horizontal.length
    var vertical = this.model.get('rows').vertical.length
    var numberOfMarkers = horizontal + vertical

    var markers = _.map(_.range(numberOfMarkers), function() {
      return new MarkerView()
    })

    _.each(_.range(vertical), function(col) {
      grid.placeContent(1, grid.model.get('horizontalOffset') + col + 1,
                        markers.shift().render().el)
    })

    _.each(_.range(horizontal), function(row) {
      grid.placeContent(grid.model.get('verticalOffset') + row + 1, 1,
                        markers.shift().render().el)
    })
  },

  writeHorizontalBlocksums: function(grid) {
    var blocks = this.model.get('rows').horizontal.pluck('blocks')
    _.each(blocks, function(block, row) {
      var add = function(a, b) {return a + b}
      var sum = _.foldl(block, add, 0)
      var space = sum + block.length - 1
      var good = space > this.model.get('rows').vertical.length - _.max(block)
      grid.placeContent(row + grid.model.get('verticalOffset') + 1, 2,
                        this.wrapSum(space, good))
    }, this)
  },

  writeVerticalBlocksums: function(grid) {
    var blocks = this.model.get('rows').vertical.pluck('blocks')
    _.each(blocks, function(block, col) {
      var add = function(a, b) {return a + b}
      var sum = _.foldl(block, add, 0)
      var space = sum + block.length - 1
      var good = space > this.model.get('rows').horizontal.length - _.max(block)
      grid.placeContent(2, col + grid.model.get('horizontalOffset') + 1,
                        this.wrapSum(space, good))
    }, this)
  },

  wrapSum: function(value, good) {
    var el = $('<div class="rowSum">').text(value)
    el.toggleClass('good', good)
    return el
  },
})

module.exports = BoardView

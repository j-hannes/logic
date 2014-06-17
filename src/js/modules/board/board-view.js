var $ = require('jquery')
var Backbone = require('backbone')
Backbone.$ = $
var _ = require('underscore')

var CellView = require('../cell/cell-view')
var MarkerView = require('../marker/marker-view')
var Block = require('../block/block')
var BlockView = require('../block/block-view')

var Grid = require('../grid/grid')
var GridView = require('../grid/grid-view')

var BoardView = Backbone.View.extend({
  el: '#board',

  initialize: function() {
    var grid = new Grid()
    this.gridView = new GridView({model: grid})
    grid.setDimensions(this.model.get('width'), this.model.get('height'))
  },

  render: function() {
    this.renderGrid()
    this.writeHorizontalBlocks()
    this.writeVerticalBlocks()
    this.writeHorizontalBlocksums()
    this.writeVerticalBlocksums()
    this.placeCells()
    this.placeMarkers()
    return this
  },

  renderGrid: function() {
    this.$el.html(this.gridView.render().el)
  },

  writeHorizontalBlocks: function() {
    var horizontalBlocks = this.model.get('rows').horizontal.pluck('blocks')
    _.each(horizontalBlocks, function(values, row) {
      var leftOffset = this.model.get('offsetX') - values.length;
      _.each(values, function(value, col) {
        var block = new Block({value: value})
        var view = new BlockView({model: block})
        this.gridView.placeContent(this.model.get('offsetY') + row + 1,
                                   leftOffset + col + 1, view.render().el)
      }, this)
    }, this)
  },

  writeVerticalBlocks: function() {
    var verticalBlocks = this.model.get('rows').vertical.pluck('blocks')
    _.each(verticalBlocks, function(values, col) {
      var topOffset = this.model.get('offsetY') - values.length;
      _.each(values, function(value, row) {
        var block = new Block({value: value})
        var view = new BlockView({model: block})
        this.gridView.placeContent(topOffset + row + 1,
                                   this.model.get('offsetX') + col + 1,
                                   view.render().el)
      }, this)
    }, this)
  },

  placeCells: function() {
    var cells = this.model.get('rows').horizontal.pluck('cells')
    _.each(cells, function(cellRow, x) {
      cellRow.each(function(cell, y) {
        var view = new CellView({model: cell})
        this.gridView.placeContent(this.model.get('offsetY') + 1 + x,
                                   this.model.get('offsetX') + 1 + y,
                                   view.render().el)
      }, this)
    }, this)
  },

  placeMarkers: function() {
    var horizontal = this.model.get('rows').horizontal.length
    var vertical = this.model.get('rows').vertical.length
    var numberOfMarkers = horizontal + vertical

    var markers = _.map(_.range(numberOfMarkers), function() {
      return new MarkerView()
    })

    _.each(_.range(vertical), function(col) {
      this.gridView.placeContent(1, this.model.get('offsetX') + col + 1,
                                 markers.shift().render().el)
    }, this)

    _.each(_.range(horizontal), function(row) {
      this.gridView.placeContent(this.model.get('offsetY') + row + 1, 1,
                                 markers.shift().render().el)
    }, this)
  },

  writeHorizontalBlocksums: function() {
    var blocks = this.model.get('rows').horizontal.pluck('blocks')
    _.each(blocks, function(block, row) {
      var add = function(a, b) {return a + b}
      var sum = _.foldl(block, add, 0)
      var space = sum + block.length - 1
      var good = space > this.model.get('rows').vertical.length - _.max(block)
      this.gridView.placeContent(row + this.model.get('offsetY') + 1, 2,
                                 this.wrapSum(space, good))
    }, this)
  },

  writeVerticalBlocksums: function() {
    var blocks = this.model.get('rows').vertical.pluck('blocks')
    _.each(blocks, function(block, col) {
      var add = function(a, b) {return a + b}
      var sum = _.foldl(block, add, 0)
      var space = sum + block.length - 1
      var good = space > this.model.get('rows').horizontal.length - _.max(block)
      this.gridView.placeContent(2, col + this.model.get('offsetX') + 1,
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

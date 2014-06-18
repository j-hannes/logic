// var Board     = require('./modules/board/board')
// var BoardView = require('./modules/board/board-view')
//
var set = require('./sets/set-9')
//
// var board = new Board()
// board.createRowsFromSet(set)
// var boardView = new BoardView({model: board})
// boardView.render()

// -----------------------------------------------------------------------------

// IMPORTS

var Backbone = require('backbone')
var _ = require('underscore')
var $ = require('jquery')
Backbone.$ = $

// DATA LAYER

var Block = Backbone.Model.extend({
  defaults: {
    value: 0,
  },
})

var BlockCollection = Backbone.Collection.extend({
  model: Block,
})

var CellState = {
  unknown: 0,
  filled: 1,
  blank: 2,
}

var Cell = Backbone.Model.extend({
  defaults: {
    state: CellState.unknown,
  },
})

var CellCollection = Backbone.Collection.extend({
  model: Cell,
})

var Marker = Backbone.Model.extend({
  defaults: {
    on: false,
  },
})

var Row = Backbone.Model.extend({
  defaults: {
    blocks: new BlockCollection(),
    cells: new CellCollection(),
    overlap: 0,
    marker: new Marker(),
    solved: false,
  },

  initialize: function() {

  },
})

var RowCollection = Backbone.Collection.extend({
  model: Row,
})

var Board = Backbone.Model.extend({
  defaults: {
    hRows: new RowCollection(),
    vRows: new RowCollection(),
  },

  initializeSet: function(set) {
    var width = set.horizontal.length
    var height = set.vertical.length
    var cellMatrix = this.produceCellMatrix(width, height)
    var transposedCellMatrix = this.transposeCellMatrix(cellMatrix)

    this.createRows('hRows', set.horizontal, cellMatrix)
    this.createRows('vRows', set.vertical, transposedCellMatrix)
  },

  produceCellMatrix: function(width, height) {
    return _.map(_.range(height), function() {
      return _.map(_.range(width), function() {
        return new Cell()
      })
    })
  },

  transposeCellMatrix: function(cells) {
    return _.zip.apply(_, cells)
  },

  createRows: function(rowType, blockRows, cellMatrix) {
    _.each(blockRows, function(blockRow, rowId) {
      this.get(rowType).add({
        blocks: blockRow,
        cells: new CellCollection(cellMatrix[rowId])
      })
    }, this)
  },
})

// VIEW LAYER

var GridView = Backbone.View.extend({

})

var BoardView = Backbone.View.extend({
  el: '#board',

  initialize: function(options) {
    this.model = new Board()
    this.model.initializeSet(options.set)
  },

  render: function() {
    this.grid = new GridView({model: new Backbone.Model({
      width: this.getRequiredFields('hRows', 'vRows'),
      height: this.getRequiredFields('vRows', 'hRows'),
    })})
    console.log(this.grid.model.get('width'), this.grid.model.get('height'))
  },

  getRequiredFields: function(rowType, otherRowType) {
    var blocks = this.model.get(rowType).pluck('blocks')
    var comparator = function(block) {return block.length}
    var spaceForMarker = 1
    var spaceForBlocks =_.max(blocks, comparator).length
    var spaceForCells = this.model.get(otherRowType).length
    return spaceForMarker + spaceForBlocks + spaceForCells
  },
})


// PROGRAM EXECUTION

var boardView = new BoardView({set: set})
boardView.render()

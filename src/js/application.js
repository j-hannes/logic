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
    rows: new RowCollection(),
    width: 0,
    height: 0,
  },

  initializeSet: function(set) {
    this.setBoardDimensions(set)

    var cellMatrix = this.produceCellMatrix()
    var transposedCellMatrix = this.transposeCellMatrix(cellMatrix)

    this.createRows(set.horizontal, cellMatrix)
    this.createRows(set.vertical, transposedCellMatrix)
  },

  setBoardDimensions: function(set) {
    this.set('width', set.vertical.length)
    this.set('height', set.horizontal.length)
  },

  produceCellMatrix: function() {
    return _.map(_.range(this.get('height')), function() {
      return _.map(_.range(this.get('width')), function() {return new Cell()})
    }, this)
  },

  transposeCellMatrix: function(cells) {
    return _.zip.apply(_, cells)
  },

  createRows: function(blockRows, cellMatrix) {
    _.each(blockRows, function(blockRow, rowId) {
      this.get('rows').add({
        blocks: blockRow,
        cells: new CellCollection(cellMatrix[rowId])
      })
    }, this)
  },

  interConnectCellsFromRow: function(rowId) {
    var isHorizontalRow = function(row) {
      return row.get('orientation') === 'horizontal'
    }
    var horizontalRows = this.get('rows').filter(isHorizontalRow)
    return _.map(horizontalRows, function(horizontalRow) {
      return horizontalRow.get('cells').at(rowId)
    },this)
  },
})

// VIEW LAYER



// PROGRAM EXECUTION

window.board = new Board()
board.initializeSet(set)
console.log(board.toJSON())

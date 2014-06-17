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
    orientation: 'horizontal',
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
    // set board dimensions
    var width = set.vertical.length
    var height = set.horizontal.length

    this.set('width', width)
    this.set('height', height)

    // produce cells
    var amountOfCells = width * height
    var cellIds = _.range(amountOfCells)

    var cells = _.map(cellIds, function() {
      return new Cell()
    })

    // create horizontal rows
    var amountOfHorizontalRows = height
    var horizontalRowIds = _.range(amountOfHorizontalRows)

    _.each(horizontalRowIds, function(rowId) {
      this.get('rows').add({
        blocks: set.horizontal[rowId],
        cells: new CellCollection(cells.splice(0, width)),
      })
    }, this)

    // create vertical rows
    var amountOfVerticalRows = width
    var verticalRowIds = _.range(amountOfVerticalRows)

    _.each(verticalRowIds, function(rowId) {
      this.get('rows').add({
        orientation: 'vertical',
        blocks: set.vertical[rowId],
        cells: this.interConnectCellsFromRow(rowId),
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

var board = new Board()
board.initializeSet(set)
console.log(board.toJSON())

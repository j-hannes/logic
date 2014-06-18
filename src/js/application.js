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
    this.getTotalWidth()
    this.grid = new GridView({model: new Backbone.Model({
      width: this.getTotalWidth(),
      height: this.getTotalHeight(),
    })})
  },

  /**
   * bad design I'd say ... why are horizontal and vertical rows put together in
   * one accessor when they need to be treated slightly different?
   */

  getTotalWidth: function() {
    var spaceForMarker = 1
    var spaceForBlocks = this.getMaxAmountOfHorizontalBlocks()
    var spaceForCells = this.model.get('width')
    return spaceForMarker + spaceForBlocks + spaceForCells
  },

  getTotalHeight: function() {
    var spaceForMarker = 1
    var spaceForBlocks = this.getMaxAmountOfVerticalBlocks()
    var spaceForCells = this.model.get('height')
    return spaceForMarker + spaceForBlocks + spaceForCells
  },

  getMaxAmountOfHorizontalBlocks: function() {
    var horizontalRows = this.model.get('rows').take(this.model.get('height'))
    var comparator = function(row) {return row.get('blocks').length}
    var rowWithMostBlocks = _.max(horizontalRows, comparator)
    return rowWithMostBlocks.get('blocks').length
  },

  getMaxAmountOfVerticalBlocks: function() {
    var verticalRows = this.model.get('rows').drop(this.model.get('height'))
    var comparator = function(row) {return row.get('blocks').length}
    var rowWithMostBlocks = _.max(verticalRows, comparator)
    return rowWithMostBlocks.get('blocks').length
  },

})


// PROGRAM EXECUTION

var boardView = new BoardView({set: set})
boardView.render()

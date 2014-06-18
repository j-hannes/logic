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

  getRequiredHorizontalFields: function() {
    return this.getRequiredFields('hRows', 'vRows')
  },

  getRequiredVerticalFields: function() {
    return this.getRequiredFields('vRows', 'hRows')
  },

  getRequiredFields: function(rowType, otherRowType) {
    var blocks = this.get(rowType).pluck('blocks')
    var comparator = function(block) {return block.length}
    var spaceForMarker = 1
    var spaceForBlocks =_.max(blocks, comparator).length
    var spaceForCells = this.get(otherRowType).length
    return spaceForMarker + spaceForBlocks + spaceForCells
  },
})

// VIEW LAYER

var GridView = Backbone.View.extend({
  template: _.template('<table><tbody></tbody></table>'),

  render: function() {
    var rowNumbers = _.range(this.model.get('height'))
    var colNumbers = _.range(this.model.get('width'))

    this.$el.html(this.template())
    var tbody = this.$('tbody')

    _.each(rowNumbers, function() {
      var row = $('<tr class="row">')
      _.each(colNumbers, function() {
        row.append($('<td class="col">'))
      }, this)
      tbody.append(row)
    }, this)

    return this
  },

  placeContent: function(row, col, content) {
    this.$el.find('.row:nth-child(' + row + ')')
            .find('.col:nth-child(' + col + ')')
            .html(content)
  },
})

var BoardView = Backbone.View.extend({
  el: '#board',

  initialize: function(options) {
    this.model = new Board()
    this.model.initializeSet(options.set)
  },

  render: function() {
    this.createGrid()
    // now place content of model in grid (assign grid fields and call render
    // function of RowView)
    return this
  },

  createGrid: function() {
    this.gridView = new GridView({model: new Backbone.Model({
      width: this.model.getRequiredHorizontalFields(),
      height: this.model.getRequiredVerticalFields(),
    })})
    this.$el.html(this.gridView.render().el)
  },
})


// PROGRAM EXECUTION

var boardView = new BoardView({set: set})
boardView.render()

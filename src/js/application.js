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

  offset: function() {
    var blocks = this.pluck('blocks')
    var comparator = function(block) {return block.length}
    var spaceForBlocks =_.max(blocks, comparator).length
    var spaceForMarker = 1
    var spaceForSum = 1
    return spaceForBlocks + spaceForMarker + spaceForSum
  },

  totalLength: function() {
    return this.offset() + this.at(0).get('cells').length
  },
})

var Board = Backbone.Model.extend({
  initializeSet: function(set) {
    var width = set.horizontal.length
    var height = set.vertical.length
    var cellMatrix = this.produceCellMatrix(width, height)
    var transposedCellMatrix = this.transposeCellMatrix(cellMatrix)

    var hRowModels = _.map(set.horizontal, this.createRowModelData(cellMatrix))
    this.set('hRows', new RowCollection(hRowModels))

    var vRowModels = _.map(set.vertical,
                           this.createRowModelData(transposedCellMatrix))
    this.set('vRows', new RowCollection(vRowModels))
  },

  createRowModelData: function(cells) {
    return function(blocks, rowId) {
      return {
        blocks: blocks,
        cells: new CellCollection(cells[rowId]),
      }
    }
  },

  produceCellMatrix: function(width, height) {
    return _.map(_.range(width), function() {
      return _.map(_.range(height), function() {
        return new Cell()
      })
    })
  },

  transposeCellMatrix: function(cells) {
    return _.zip.apply(_, cells)
  },
})

// VIEW LAYER

var RowView = Backbone.View.extend({
})

var RowCollectionView = Backbone.View.extend({
})

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

    var view = new RowCollectionView({collection: this.model.get('hRows')})
    view.render({
      gridView: this.gridView,
      fromRow: 1,
      withCells: true,
    })

    // now place content of model in grid (assign grid fields and call render
    // function of RowView)
    return this
  },

  createGrid: function() {
    this.gridView = new GridView({model: new Backbone.Model({
      width: this.model.get('hRows').totalLength(),
      height: this.model.get('vRows').totalLength(),
    })})
    this.$el.html(this.gridView.render().el)
  },
})


// PROGRAM EXECUTION

var boardView = new BoardView({set: set})
boardView.render()

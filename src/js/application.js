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
        blocks: new BlockCollection(_.map(blocks, function(block) {
          return {value: block}
        })),
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

var MarkerView = Backbone.View.extend({
  className: 'marker',

  events: {
    'click': 'toggleMark',
  },

  toggleMark: function() {
    this.$el.toggleClass('marked')
  },

  render: function(coord) {
    var target = $('*[data-coord="' + coord.x + ',' + coord.y + '"]')
    // this.$el.text('M') // FIXME devtrace
    this.$el.appendTo(target)
  }
})

var OverlapView = Backbone.View.extend({
  className: 'overlap',

  render: function(coord) {
    var target = $('*[data-coord="' + coord.x + ',' + coord.y + '"]')
    // this.$el.text('O') // FIXME devtrace
    this.$el.appendTo(target)
  }
})

var BlockView = Backbone.View.extend({
  className: 'block',

  render: function(coord) {
    var target = $('*[data-coord="' + coord.x + ',' + coord.y + '"]')
    this.$el.text(this.model.get('value'))
    this.$el.appendTo(target)
  },
})
var BlockCollectionView = Backbone.View.extend({
  render: function(coordinates) {
    this.collection.each(function(block, index) {
      var view = new BlockView({model: block})
      view.render(coordinates[index])
    }, this)
  }

})

// var CellView = Backbone.View.extend({
//
// })
var CellCollectionView = Backbone.View.extend({

})

var RowView = Backbone.View.extend({
  render: function(options, coordinates) {
    var markerView = new MarkerView({model: this.model.get('marker')})
    markerView.render(coordinates.marker)

    var overlapView = new OverlapView({model: this.model.get('overlap')})
    overlapView.render(coordinates.overlap)

    var blocksView = new BlockCollectionView({
      collection: this.model.get('blocks')
    })
    blocksView.render(coordinates.blocks)

    var cellsView = new CellCollectionView({
      collection: this.model.get('cells')
    })
    // cellsView.render(coordinates.cellsPos)
  },
})


var RowCollectionView = Backbone.View.extend({
  getBlockSpace: function() {
    var blocks = this.collection.pluck('blocks')
    return _.max(blocks, function(block) {return block.length}).length
  },

  getOffset: function() {
    var spaceForMarker = 1
    var spaceForIndicator = 1
    return spaceForMarker + spaceForIndicator + this.getBlockSpace()
  },

  getTotalLength: function() {
    var amountOfCells = this.collection.at(0).get('cells').length
    return this.getOffset() + amountOfCells
  },

  render: function(options) {
    this.collection.each(function(row, rowId) {
      var coordinates = this.getCoordinates(rowId)
      var rowView = new RowView({model: row})
      rowView.render(options, coordinates)
    }, this)
  },
})

var RowCollectionHorizontalView = RowCollectionView.extend({
  getCoordinates: function(rowId) {
    var position = this.offsetY + rowId
    var blocks = _.map(_.range(this.getBlockSpace()), function(blockPos) {
      var amountOfBlocks = this.collection.at(rowId).get('blocks').length
      var buffer = this.getBlockSpace() - amountOfBlocks
      var x = 2 + buffer + blockPos
      return {x: x, y: position}
    }, this)
    var coords = {
      marker: {x: 0, y: position},
      overlap: {x: 1, y: position},
      blocks: blocks
    }
    return coords
  },
})

var RowCollectionVerticalView = RowCollectionView.extend({
  getCoordinates: function(rowId) {
    var position = this.offsetX + rowId
    var blocks = _.map(_.range(this.getBlockSpace()), function(blockPos) {
      var buffer = this.getBlockSpace() - this.collection.at(rowId).get('blocks').length
      return {x: position, y: 2 + buffer + blockPos}
    }, this)
    return {
      marker: {x: position, y: 0},
      overlap: {x: position, y: 1},
      blocks: blocks,
    }
  },
})

var GridView = Backbone.View.extend({
  tagName: 'table',

  template: _.template('<tbody></tbody>'),

  render: function() {
    var rowNumbers = _.range(this.model.get('height'))
    var colNumbers = _.range(this.model.get('width'))

    this.$el.html(this.template())
    var tbody = this.$('tbody')

    _.each(rowNumbers, function(y) {
      var row = $('<tr class="row">')
      _.each(colNumbers, function(x) {
        row.append($('<td class="col" data-coord="' + x + ','+ y + '">'))
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
    // options.set.horizontal.splice(5,20)
    // options.set.vertical.splice(5,30)
    this.model = new Board()
    this.model.initializeSet(options.set)

    this.horizontalRowsView = new RowCollectionHorizontalView({
      collection: this.model.get('hRows'),
    })

    this.verticalRowsView = new RowCollectionVerticalView({
      collection: this.model.get('vRows'),
    })

    // FUCK IT!
    this.verticalRowsView.offsetX = this.horizontalRowsView.getOffset()
    this.horizontalRowsView.offsetY = this.verticalRowsView.getOffset()

    var gridModel = new Backbone.Model({
      width: this.horizontalRowsView.getTotalLength(),
      height: this.verticalRowsView.getTotalLength(),
    })
    this.gridView = new GridView({model: gridModel})
  },

  render: function() {
    this.$el.html(this.gridView.render().el)
    this.horizontalRowsView.render()
    this.verticalRowsView.render()
    return this
  },
})


// PROGRAM EXECUTION

var boardView = new BoardView({set: set})
boardView.render()

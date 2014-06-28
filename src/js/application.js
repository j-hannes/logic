// IMPORTS

var Backbone = require('backbone')
var _ = require('underscore')
var $ = require('jquery')
Backbone.$ = $

var set = require('./sets/set-9')

// DATA LAYER

var Block = Backbone.Model.extend({
  defaults: {
    value: 0,
    crossed: false,
  },
})

var BlockCollection = Backbone.Collection.extend({
  model: Block,

  getLargestBlockValue: function() {
    var largestBlock = this.max(function(block) {
      return block.get('value')
    })

    return largestBlock.get('value')
  },

  getRequiredSpace: function() {
    var add = function(a, b) {return a + b}
    var sum = _.foldl(this.pluck('value'), add, 0)
    var spaceInbetween = this.length - 1
    return sum + spaceInbetween
  },
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

  nextState: function() {
    switch (this.get('state')) {
      case CellState.unknown:
        this.set('state', CellState.filled)
        break

      case CellState.filled:
        this.set('state', CellState.blank)
        break

      case CellState.blank:
        this.set('state', CellState.unknown)
        break
    }
  },

  previousState: function() {
    switch (this.get('state')) {
      case CellState.unknown:
        this.set('state', CellState.blank)
        break

      case CellState.filled:
        this.set('state', CellState.unknown)
        break

      case CellState.blank:
        this.set('state', CellState.filled)
        break
    }
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

var Indicator = Backbone.Model.extend({
  defaults: {
    overlap: 0,
  },

  isGood: function() {
    return this.row.isGood()
  },
})

var Row = Backbone.Model.extend({
  defaults: {
    solved: false,
  },

  initialize: function() {
    this.set('indicator', new Indicator())
    this.set('marker', new Marker())
    var indicator = this.get('indicator')
    indicator.row = this
    var overlap = this.getOverlap()
    indicator.set('overlap', overlap)

    this.listenTo(this.get('cells'), 'change:state',
                  this.onCellStateChange)
  },

  onCellStateChange: function() {
    this.get('marker').set('on', true)
  },

  getAvailableSpace: function() {
    return this.get('cells').length
  },

  getRequiredSpace: function() {
    return this.get('blocks').getRequiredSpace()
  },

  getLargestBlock: function() {
    return this.get('blocks').getLargestBlockValue()
  },

  getOverlap: function() {
    return this.getRequiredSpace()
  },

  isGood: function() {
    var largestBlock   = this.getLargestBlock()
    var availableSpace = this.getAvailableSpace()
    var requiredSpace  = this.getRequiredSpace()
    return largestBlock > availableSpace - requiredSpace
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

    this.listenTo(this, 'mousedown', this.onMouseDown)
    this.listenTo(this, 'mouseup', this.onMouseUp)
  },

  onMouseDown: function(e) {
    this.mousePressed = e.which
  },

  onMouseUp: function() {
    this.mousePressed = undefined
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
    'click': 'onClick',
  },

  onClick: function() {
    this.model.set('on', !this.model.get('on'))
  },

  initialize: function() {
    this.listenTo(this.model, 'change:on', this.toggleMark)
  },

  toggleMark: function() {
    this.$el.toggleClass('marked', this.model.get('on'))
  },

  render: function(coord) {
    var target = $('*[data-coord="' + coord.x + ',' + coord.y + '"]')
    this.$el.appendTo(target)
  }
})

var IndicatorView = Backbone.View.extend({
  className: 'indicator',

  render: function(coord) {
    var $target = $('*[data-coord="' + coord.x + ',' + coord.y + '"]')
    var value = this.model.get('overlap')
    this.$el.text(value)
    this.$el.toggleClass('good', this.model.isGood())
    $target.html(this.$el)
  }
})

var BlockView = Backbone.View.extend({
  className: 'block',

  events: {
    'click': 'onClick',
  },

  onClick: function() {
    this.model.set('crossed', !this.model.get('crossed'))
  },

  initialize: function() {
    this.listenTo(this.model, 'change:crossed', this.toggleCrossed)
  },

  toggleCrossed: function() {
    this.$el.toggleClass('crossed', this.model.get('crossed'))
  },

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
    })
  }
})

var CellView = Backbone.View.extend({
  className: 'cell',

  events: {
    'click': 'onClick',
    'contextmenu': 'onRightClick',
    'mousedown': 'onMouseDown',
    'mouseup': 'onMouseUp',
    'mousemove': 'onMouseMove',
  },

  onClick: function() {
    this.model.nextState()
  },

  onRightClick: function(e) {
    e.preventDefault()
    this.model.previousState()
    return false
  },

  onMouseDown: function(e) {
    // console.log(e.which)
    // console.log(this.model.cid, 'mousedown')
    this.board.trigger('mousedown', e)
  },

  onMouseUp: function(e) {
    // console.log(this.model.cid, 'mouseup')
    this.board.trigger('mouseup', e)
  },

  onMouseMove: function() {
    if (this.board.mousePressed === 1 && this.board.dragCell !== this) {
      this.model.set('state', CellState.filled)
    }
    if (this.board.mousePressed === 3 && this.board.dragCell != this) {
      this.model.set('state', CellState.blank)
    }
  },

  initialize: function() {
    this.listenTo(this.model, 'change', this.onModelChange)
  },

  onModelChange: function() {
    switch (this.model.get('state')) {
      case CellState.unknown:
        this.$el.html('')
        this.$el.removeClass('on')
        break

      case CellState.filled:
        this.$el.html('')
        this.$el.addClass('on')
        break

      case CellState.blank:
        this.$el.removeClass('on')
        this.$el.text('•')
        break
    }
  },

  render: function(coord) {
    var $target = $('*[data-coord="' + coord.x + ',' + coord.y + '"]')
    // this.$el.text(this.model.cid) // FIXME devtrace
    $target.html(this.$el)
  }
})
var CellCollectionView = Backbone.View.extend({
  render: function(coordinates) {
    this.collection.each(function(cell, index) {
      var view = new CellView({model: cell})
      view.render(coordinates[index])
      view.board = this.board
    }, this)
  },
})

var RowView = Backbone.View.extend({
  render: function(options, coordinates) {
    var markerView = new MarkerView({model: this.model.get('marker')})
    markerView.render(coordinates.marker)

    var indicatorView = new IndicatorView({model: this.model.get('indicator')})
    indicatorView.render(coordinates.indicator)

    var blocksView = new BlockCollectionView({
      collection: this.model.get('blocks')
    })
    blocksView.render(coordinates.blocks)

    var cellsView = new CellCollectionView({
      collection: this.model.get('cells')
    })
    cellsView.board = this.board
    cellsView.render(coordinates.cells)
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
      rowView.board = this.board
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
    var cells = _.map(this.collection.at(0).get('cells'), function(cell, cellPos) {
      return {x: this.getOffset() + cellPos, y: position}
    }, this)
    var coords = {
      marker: {x: 0, y: position},
      indicator: {x: 1, y: position},
      blocks: blocks,
      cells: cells,
    }
    return coords
  },
})
var RowCollectionVerticalView = RowCollectionView.extend({
  getCoordinates: function(rowId) {
    var position = this.offsetX + rowId
    var blocks = _.map(_.range(this.getBlockSpace()), function(blockPos) {
      var amountOfBlocks = this.collection.at(rowId).get('blocks').length
      var buffer = this.getBlockSpace() - amountOfBlocks
      var y = 2 + buffer + blockPos
      return {x: position, y: y}
    }, this)
    var cells = _.map(this.collection.at(0).get('cells'), function(cell, cellPos) {
      return {y: this.getOffset() + cellPos, x: position}
    }, this)
    var coords = {
      marker: {x: position, y: 0},
      indicator: {x: position, y: 1},
      blocks: blocks,
      cells: cells,
    }
    return coords
  },
})

var GridView = Backbone.View.extend({
  tagName: 'table',

  rowTemplate: _.template('<tr class="row"></tr>'),
  colTemplate: _.template('<td class="col"></td>'),

  render: function() {
    var rowIds = _.range(this.model.get('height'))  // [0 .. height - 1]
    var colIds = _.range(this.model.get('width'))   // [0 .. width  - 1]

    _.each(rowIds, function(rowId) {
      var $row = $(this.rowTemplate())
      _.each(colIds, function(colId) {
        var $col = $(this.colTemplate())
        $col.attr('data-coord', colId + ',' + rowId)
        $row.append($col)
      }, this)
      this.$el.append($row)
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
    this.horizontalRowsView.board = this.model

    this.verticalRowsView = new RowCollectionVerticalView({
      collection: this.model.get('vRows'),
    })
    this.verticalRowsView.board = this.model

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

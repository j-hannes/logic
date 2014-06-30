// IMPORTS

var Backbone = require('backbone')
var _ = require('underscore')
var $ = require('jquery')
Backbone.$ = $

var set = require('./sets/set-9')

// PROGRAM

//var Board = Backbone.Model.extend({
var CellState = {
  unknown: 0,
  filled: 1,
  empty: 2,
}

var Cell = Backbone.Model.extend({
  defaults: {
    'state': CellState.unknown,
  },
})

var Row = Backbone.Model.extend({
  // this is the data type to be send to the haskell backend
  // hence the backbone model
})

var createBoard = function(set) {
  var width = set.vertical.length
  var height = set.horizontal.length

  var cells = _.map(_.range(height), function() {
    return _.map(_.range(width), function() {
      return new Cell()
    })
  })

  var xRows = _.map(set.horizontal, function(blocks, rowId) {
    var cellRow = cells[rowId]
    return new Row({blocks: blocks, cells: cellRow})
  })

  var yRows = _.map(set.vertical, function(blocks, rowId) {
    var cellColumn = _.map(cells, function(cells) {
      return cells[rowId]
    })
    return new Row({blocks: blocks, cells: cellColumn})
  })

  return {
    xRows: xRows,
    yRows: yRows,
  }
}

var BlockView = Backbone.View.extend({
  className: 'block',

  render: function() {
    this.$el.text(this.model)
    return this
  },
})

var CellView = Backbone.View.extend({
  className: 'cell',
})

var RowView = Backbone.View.extend({
  tagName: 'tr',
  className: 'row',
  
  render: function() {
    var $rowValuesColumn = $('<td class="col xBlocks">')
    _.each(this.model.get('blocks'), function(block) {
      var blockView = new BlockView({model: block})
      $rowValuesColumn.append(blockView.render().el)
    })
    this.$el.html($rowValuesColumn)

    _.each(this.model.get('cells'), function(cell) {
      var cellView = new CellView({model: cell})
      var $cellColumn = $('<td class="col">')
      $cellColumn.append(cellView.render().el)
      this.$el.append($cellColumn)
    }, this)

    return this
  }
})

var BoardView = Backbone.View.extend({
  tagName: 'table',

  render: function() {
    _.each(this.model.xRows, function(row) {
      var rowView = new RowView({model: row})
      this.$el.append(rowView.render().el)
    }, this)

    var $yRowValues = $('<tr class="row">')
    $yRowValues.append($('<td class="col xBlocks title">').text('a'))

    _.each(this.model.yRows, function(row) {
      var $yBlocksCol = $('<td class="col yBlocks">')
      _.each(row.get('blocks'), function(block) {
        $yBlocksCol.append($('<div class="block">').text(block))
      })
      $yRowValues.append($yBlocksCol)
    })

    this.$el.prepend($yRowValues)

    // and now we just need to render the row values of the vertical rows
    
    return this
  },
})

window.board = createBoard(set)
window.boardView = new BoardView({model: window.board})
$('#board').html(window.boardView.render().el)

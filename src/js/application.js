// IMPORTS

var Backbone = require('backbone')
var _ = require('underscore')
var $ = require('jquery')
Backbone.$ = $

var board = require('./modules/board')

var set = require('./sets/set-9')


// PROGRAM

var BlockView = Backbone.View.extend({
  className: 'block',

  render: function() {
    this.$el.text(this.model.get('length'))
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
        $yBlocksCol.append($('<div class="block">').text(block.get('length')))
      })
      $yRowValues.append($yBlocksCol)
    })

    this.$el.prepend($yRowValues)

    // and now we just need to render the row values of the vertical rows
    
    return this
  },
})

window.board = board.create(set)
window.boardView = new BoardView({model: window.board})
$('#board').html(window.boardView.render().el)

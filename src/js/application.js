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

var ColumnView = Backbone.View.extend({
  tagName: 'td',
  className: 'col',

  render: function(content, blockClass) {
    this.$el.append(content)
    this.$el.addClass(blockClass)
    return this
  },
})

// create AND render?
var createBlockElement = function(model) {
  var view = new BlockView({model: model})
  return view.render().el
}

// two things in once?
var createCellColumnElement = function(cellModel) {
  var cellView = new CellView({model: cellModel})
  var columnView = new ColumnView()
  return columnView.render(cellView.render().el).el
}

var RowView = Backbone.View.extend({
  tagName: 'tr',
  className: 'row',
  
  render: function() {
    this.renderBlockColumn()
    this.renderCellColumns()
    return this
  },

  renderBlockColumn: function() {
    var blockViews = _.map(this.model.get('blocks'), createBlockElement)
    var columnView = new ColumnView()
    this.$el.html(columnView.render(blockViews, 'xBlocks').el)
  },

  renderCellColumns: function() {
    var cellColumns = _.map(this.model.get('cells'), createCellColumnElement)
    this.$el.append(cellColumns)
  },
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

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

var createBlockElement = function(model) {
  // create AND render?
  var view = new BlockView({model: model})
  return view.render().el
}

var createCellColumnElement = function(cellModel) {
  // two things in once?
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

var YBlockCol = Backbone.View.extend({
  tagName: 'td',
  className: 'col yBlocks',

  render: function() {
    var blocks = _.map(this.model.get('blocks'), createBlockElement)
    this.$el.append(blocks)
    return this
  },
})

var createYBlockElement = function(rowModel) {
  var yBlockCol = new YBlockCol({model: rowModel})
  return yBlockCol.render().el
}

var TitleColumnView = Backbone.View.extend({
  // This is like coded HTML. Question: Can we put this in (hbs) templates?
  tagName: 'td',
  className: 'col xBlocks title',

  render: function() {
    this.$el.text(this.model.title)
    return this
  },
})

var HeadRow = Backbone.View.extend({
  tagName: 'tr',
  className: 'row',

  render: function() {
    var titleView = new TitleColumnView({model: this.model})
    this.$el.append(titleView.render().el)

    var yBlockElements =  _.map(this.model.yRows, createYBlockElement)
    this.$el.append(yBlockElements)

    return this
  },
})

var createRowElement = function(model) {
  var view = new RowView({model: model})
  return view.render().el
}

var Board = Backbone.View.extend({
  tagName: 'table',

  render: function() {
    var rowElements = _.map(this.model.xRows, createRowElement)
    this.$el.append(rowElements)

    var blockValuesTopRowView = new HeadRow({model: this.model})
    this.$el.prepend(blockValuesTopRowView.render().el)

    return this
  },
})

window.board = board.create(set)
window.boardView = new Board({model: window.board})
$('#board').html(window.boardView.render().el)

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

var createBlock = function(model) {
  var view = new BlockView({model: model})
  return view.render().el
}

var createCellColumn = function(cellModel) {
  // two things in once?
  var cellView = new CellView({model: cellModel})
  var columnView = new ColumnView()
  return columnView.render(cellView.render().el).el
}

var createBlockColumn = function(model) {
  var blockViews = _.map(model.get('blocks'), createBlock)
  var columnView = new ColumnView()
  return columnView.render(blockViews, 'xBlocks').el
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
    this.$el.html(createBlockColumn(this.model))
  },

  renderCellColumns: function() {
  this.$el.append(_.map(this.model.get('cells'), createCellColumn))
  },
})

var YBlockCol = Backbone.View.extend({
  tagName: 'td',
  className: 'col yBlocks',

  render: function() {
    this.$el.append(_.map(this.model.get('blocks'), createBlock))
    return this
  },
})

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
    this.createAndRenderTitleColumnView()
    this.createAndRenderYBlockColViews()
    return this
  },

  createAndRenderTitleColumnView: function() {
    var view = new TitleColumnView({model: this.model})
    this.$el.html(view.render().el)
  },

  createAndRenderYBlockColViews: function() {
    var views = _.map(this.model.yRows, this.createYBlockColView)
    _.each(views, this.renderYBlockColView, this)
  },

  createYBlockColView: function(model) {
    return new YBlockCol({model: model})
  },

  renderYBlockColView: function(view) {
    this.$el.append(view.render().el)
  },
})

var Board = Backbone.View.extend({
  tagName: 'table',

  render: function() {
    this.createAndRenderHeadRowView()
    this.createAndRenderRowViews()
    return this
  },

  createAndRenderHeadRowView: function() {
    var view = new HeadRow({model: this.model})
    this.$el.html(view.render().el)
  },

  createAndRenderRowViews: function() {
    var views = this.createRowViews()
    _.each(views, this.renderRowView, this)
  },
  
  renderRowView: function(view) {
    this.$el.append(view.render().el)
  },

  createRowViews: function() {
    return _.map(this.model.xRows, this.createRowView)
  },

  createRowView: function(model) {
    return new RowView({model: model})
  },
})

window.board = board.create(set)
window.boardView = new Board({model: window.board})
$('#board').html(window.boardView.render().el)

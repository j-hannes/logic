var $ = require('jquery')
var Backbone = require('backbone')
Backbone.$ = $

var GridView = require('./grid-view')
var Grid = require('./grid')

var Puzzle = require('./puzzle')
var set = require('./set')

module.exports = Backbone.View.extend({
  initialize: function() {
    window.puzzle = new Puzzle(set)
    
    var grid = new Grid({
      width: puzzle.width,
      height: puzzle.height,
    })

    var view = new GridView({model: grid})

    //   model: grid
  },
})

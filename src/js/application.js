var $ = require('jquery')

var Board     = require('./modules/board/board')
var BoardView = require('./modules/board/board-view')

var set = require('./sets/set-9')

$(document).ready(function() {
  var board = new Board()
  board.createRowsFromSet(set)
  var boardView = new BoardView({model: board})
  boardView.render()
})

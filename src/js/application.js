var Board     = require('./modules/board/board')
var BoardView = require('./modules/board/board-view')
var Grid      = require('./modules/grid/grid')
var GridView  = require('./modules/grid/grid-view')

var set = require('./sets/set-9')

var board = new Board()
board.createRowsFromSet(set)

var grid = new Grid(board)

var gridView = new GridView({model: grid})
var boardView = new BoardView({model: board})
boardView.renderToGrid(gridView)

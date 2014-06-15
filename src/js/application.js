var Board = require('./modules/board/board')
var Grid = require('./modules/grid/grid')
var GridView = require('./modules/grid/grid-view')

var set = require('./sets/set-9')

var board = new Board(set)
var grid = new Grid(board)
new GridView({model: grid})

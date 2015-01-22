/* global contains, takeWhile, dropWhile, not, compose, tail, map */
/* global words, lines */
require('./lib/hs').expose(global);
var fs = require('fs');

//+ a -> String
var toString = function(obj) {return obj.toString()};
//+ FilePath -> String
var readFile = compose(toString, fs.readFileSync);

//+ [String] -> Bool
var delimiter = contains('');
//+ [a] -> [a]
var getHorizontalBlocks = takeWhile(not(delimiter));
//+ [a] -> [a]
var getVerticalBlocks = compose(
  takeWhile(not(delimiter)),
  tail,
  dropWhile(not(delimiter))
);
//+ String -> PuzzleConfig
var parseConfig = function(configString) {
  var configBlocks = map(words, lines(configString));
  return {
    horizontalBlocks: getHorizontalBlocks(configBlocks),
    verticalBlocks: getVerticalBlocks(configBlocks),
  };
};
// type PuzzleConfig = {
//     horizontalBlocks :: [BlockLengths]
//   , verticalBlocks :: [BlockLenghts]
// }

//+ FilePath -> PuzzleConfig
module.exports = compose(parseConfig, readFile);


/* global contains, takeWhile, dropWhile, not, compose, tail, map */
/* global words, lines */
require('./lib/hs').expose(global);
var fs = require('fs');


/**
 * Reads a file from the file system and returns its content.
 */
// FilePath -> String
var toString = function(obj) {return obj.toString()};
var readFile = compose(toString, fs.readFileSync);


var delimiter = contains('');
var getHorizontalBlocks = takeWhile(not(delimiter));
var getVerticalBlocks = compose(
  takeWhile(not(delimiter)),
  tail,
  dropWhile(not(delimiter))
);
var parseConfig = function(configString) {
  var configBlocks = map(words, lines(configString));
  return {
    horizontalBlocks: getHorizontalBlocks(configBlocks),
    verticalBlocks: getVerticalBlocks(configBlocks),
  };
};


/**
 * Pass a file path to receive a puzzle config object.
 */
// data PuzzleConfig = PuzzleConfig {
//     horizontalBlocks :: [BlockLengths]
//   , verticalBlocks :: [BlockLenghts]
// }
//
// Int -> PuzzleConfig
module.exports = compose(parseConfig, readFile);


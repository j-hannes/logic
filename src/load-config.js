/* global contains, takeWhile, dropWhile, not, compose, tail, map */
/* global words, lines */
require('./lib/hs').expose(global);
var fs = require('fs');

//+ toString :: a -> String
var toString = function(obj) {return obj.toString()};

//+ readFile :: FilePath -> String
var readFile = compose(toString, fs.readFileSync);

//+ delimiter :: [String] -> Bool
var delimiter = contains('');

//+ getHorizontalBlocks :: [a] -> [a]
var getHorizontalBlocks = takeWhile(not(delimiter));

//+ getVerticalBlocks :: [a] -> [a]
var getVerticalBlocks = compose(
  takeWhile(not(delimiter)),
  tail,
  dropWhile(not(delimiter))
);

// type PuzzleConfig = {
//     horizontalBlocks :: [BlockLengths]
//   , verticalBlocks :: [BlockLenghts]
// }

//+ parseConfig :: String -> PuzzleConfig
var parseConfig = function(configString) {
  var configBlocks = map(words, lines(configString));
  return {
    horizontalBlocks: getHorizontalBlocks(configBlocks),
    verticalBlocks: getVerticalBlocks(configBlocks),
  };
};

//+ loadConfig :: FilePath -> PuzzleConfig
var loadConfig = compose(parseConfig, readFile);

module.exports = loadConfig


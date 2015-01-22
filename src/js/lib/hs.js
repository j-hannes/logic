/**
 * This module is a wrapper around ramda.js to expose its functions to
 * the global namespace and complememt it with Haskell standard library
 * functions (drop, words, lines etc.).
 */
var r = require('ramda')

/**
 * The expose function lets you bind all function to the global namespace.
 * That way they can be used without any prefix (`_.` or `r.` etc), but
 * directly like `map(...)` or `compose(...)`. To do that simply puta
 * `require('hs').expose(global)` on top of your file.
 */
r.expose = function(env) {
  var fns = Object.keys(r)
  r.forEach(function(f) {env[f] = r[f]}, fns)
  delete env.expose
}

/** 
 * Add some commonly used haskell functions.
 */
r.words = r.split(' ');
r.lines = r.split('\n');
r.drop = r.skip
r.dropWhile = r.curry(function(cond, list) {
  return r.skipUntil(r.not(cond), list)
})

// export the extended ramda library
module.exports = r


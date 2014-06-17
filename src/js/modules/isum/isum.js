var Backbone = require('backbone')
var _ = require('underscore')

module.exports = Backbone.Model.extend({
  requiredSpace: function() {
    var add = function(a, b) {return a + b}
    var sum = _.foldl(this.get('blocks'), add, 0)
    var space = this.get('blocks').length - 1
    return sum + space
  },

  getOverlap: function() {
    var availableSpace = this.get('numBlocks')
    var requiredSpace = this.requiredSpace()
    var largestBlock = _.max(this.get('blocks'))
    return requiredSpace + largestBlock - availableSpace
  },

  isGood: function() {
    return this.getOverlap() > 0
  },
})

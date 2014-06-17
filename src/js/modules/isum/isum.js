var Backbone = require('backbone')
var _ = require('underscore')

module.exports = Backbone.Model.extend({
  getSum: function() {
    var add = function(a, b) {return a + b}
    var sum = _.foldl(this.get('blocks'), add, 0)
    var space = this.get('blocks').length - 1
    return sum + space
  },

  isGood: function() {
    var availableSpace = this.get('numBlocks')
    var requiredSpace = this.getSum()
    var largestBlock = _.max(this.get('blocks'))
    return requiredSpace + largestBlock > availableSpace
  }
})

'use strict';

var _ = require('lodash');

/**
 * ID3 Decision Tree Algorithm
 * @module DecisionTreeID3
 */

module.exports = function () {

  /**
   * Map of valid tree node types
   * @constant
   * @static
   */
  var NODE_TYPES = DecisionTreeID3.NODE_TYPES = {
    RESULT: 'result',
    FEATURE: 'feature',
    FEATURE_VALUE: 'feature_value'
  };

  /**
   * Underlying model
   * @private
   */
  var _model;

  /**
   * @constructor
   * @return {DecisionTreeID3}
   */
  function DecisionTreeID3(data, target, features) {
    switch (arguments.length) {
      case 1:
        this.import(arguments[0]);
        break;
      case 3:
        this.data = data;
        this.target = target;
        this.features = features;
        _model = createTree(data, target, features);
        break;
      default:
        throw new Error('Invalid arguments passed to constructor. Check documentation on usage');
    }
  }

  /**
   * @public API
   */
  DecisionTreeID3.prototype = {

    /**
     * Predicts class for sample
     */
    predict: function predict(sample) {
      var root = _model;

      var _loop = function _loop() {
        var attr = root.name;
        var sampleVal = sample[attr];
        var childNode = _.find(root.vals, function (node) {
          return node.name == sampleVal;
        });
        if (childNode) {
          root = childNode.child;
        } else {
          root = root.vals[0].child;
        }
      };

      while (root.type !== NODE_TYPES.RESULT) {
        _loop();
      }

      return root.val;
    },

    /**
     * Evalutes prediction accuracy on samples
     */
    evaluate: function evaluate(samples) {
      var instance = this;
      var target = this.target;

      var total = 0;
      var correct = 0;

      _.each(samples, function (s) {
        total++;
        var pred = instance.predict(s);
        var actual = s[target];
        if (_.isEqual(pred, actual)) {
          correct++;
        }
      });

      return correct / total;
    },

    /**
     * Imports a previously saved model with the toJSON() method
     */
    import: function _import(json) {
      var model = json.model,
          data = json.data,
          target = json.target,
          features = json.features;


      _model = model;
      this.data = data;
      this.target = target;
      this.features = features;
    },

    /**
     * Returns JSON representation of trained model
     */
    toJSON: function toJSON() {
      var data = this.data,
          target = this.target,
          features = this.features;

      var model = _model;

      return { model: model, data: data, target: target, features: features };
    }
  };

  /**
   * Creates a new tree
   * @private
   */
  function createTree(data, target, features) {
    var targets = _.uniq(_.map(data, target));
    if (targets.length == 1) {
      return {
        type: NODE_TYPES.RESULT,
        val: targets[0],
        name: targets[0],
        alias: targets[0] + randomUUID()
      };
    }

    if (features.length == 0) {
      var topTarget = mostCommon(targets);
      return {
        type: NODE_TYPES.RESULT,
        val: topTarget,
        name: topTarget,
        alias: topTarget + randomUUID()
      };
    }

    var bestFeature = maxGain(data, target, features);
    var remainingFeatures = _.without(features, bestFeature);
    var possibleValues = _.uniq(_.map(data, bestFeature));

    var node = {
      name: bestFeature,
      alias: bestFeature + randomUUID()
    };

    node.type = NODE_TYPES.FEATURE;
    node.vals = _.map(possibleValues, function (v) {
      var _newS = data.filter(function (x) {
        return x[bestFeature] == v;
      });

      var child_node = {
        name: v,
        alias: v + randomUUID(),
        type: NODE_TYPES.FEATURE_VALUE
      };

      child_node.child = createTree(_newS, target, remainingFeatures);
      return child_node;
    });

    return node;
  }

  /**
   * Computes entropy of a list
   * @private
   */
  function entropy(vals) {
    var uniqueVals = _.uniq(vals);
    var probs = uniqueVals.map(function (x) {
      return prob(x, vals);
    });

    var logVals = probs.map(function (p) {
      return -p * log2(p);
    });

    return logVals.reduce(function (a, b) {
      return a + b;
    }, 0);
  }

  /**
   * Computes gain
   * @private
   */
  function gain(data, target, feature) {
    var attrVals = _.uniq(_.map(data, feature));
    var setEntropy = entropy(_.map(data, target));
    var setSize = _.size(data);

    var entropies = attrVals.map(function (n) {
      var subset = data.filter(function (x) {
        return x[feature] === n;
      });

      return subset.length / setSize * entropy(_.map(subset, target));
    });

    var sumOfEntropies = entropies.reduce(function (a, b) {
      return a + b;
    }, 0);

    return setEntropy - sumOfEntropies;
  }

  /**
   * Computes Max gain across features to determine best split
   * @private
   */
  function maxGain(data, target, features) {
    return _.max(features, function (element) {
      return gain(data, target, element);
    });
  }

  /**
   * Computes probability of of a given value existing in a given list
   * @private
   */
  function prob(value, list) {
    var occurrences = _.filter(list, function (element) {
      return element === value;
    });

    var numOccurrences = occurrences.length;
    var numElements = list.length;
    return numOccurrences / numElements;
  }

  /**
   * Computes Log with base-2
   * @private
   */
  function log2(n) {
    return Math.log(n) / Math.log(2);
  }

  /**
   * Finds element with highest occurrence in a list
   * @private
   */
  function mostCommon(list) {
    var elementFrequencyMap = {};
    var largestFrequency = -1;
    var mostCommonElement = null;

    list.forEach(function (element) {
      var elementFrequency = (elementFrequencyMap[element] || 0) + 1;
      elementFrequencyMap[element] = elementFrequency;

      if (largestFrequency < elementFrequency) {
        mostCommonElement = element;
        largestFrequency = elementFrequency;
      }
    });

    return mostCommonElement;
  }

  /**
   * Generates random UUID
   * @private
   */
  function randomUUID() {
    return "_r" + Math.random().toString(32).slice(2);
  }

  /**
   * @class DecisionTreeID3
   */
  return DecisionTreeID3;
}();
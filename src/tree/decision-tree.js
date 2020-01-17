const _ = require('lodash');

/**
 * ID3 Decision Tree Algorithm
 * @module DecisionTreeID3
 */

module.exports = (function () {
  /**
   * Map of valid tree node types
   * @constant
   * @static
   */
  const NODE_TYPES = DecisionTreeID3.NODE_TYPES = {
    RESULT: 'result',
    FEATURE: 'feature',
    FEATURE_VALUE: 'feature_value',
  };

  /**
   * Underlying model
   * @private
   */
  let _model;

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
    predict(sample) {
      let root = _model;
      while (root.type !== NODE_TYPES.RESULT) {
        const attr = root.name;
        const sampleVal = sample[attr];
        const childNode = _.find(root.vals, node => node.name == sampleVal);
        if (childNode) {
          root = childNode.child;
        } else {
          root = root.vals[0].child;
        }
      }

      return root.val;
    },

    /**
     * Evalutes prediction accuracy on samples
     */
    evaluate(samples) {
      const instance = this;
      const { target } = this;

      let total = 0;
      let correct = 0;

      _.each(samples, (s) => {
        total++;
        const pred = instance.predict(s);
        const actual = s[target];
        if (_.isEqual(pred, actual)) {
          correct++;
        }
      });

      return correct / total;
    },

    /**
     * Imports a previously saved model with the toJSON() method
     */
    import(json) {
      const {
        model, data, target, features,
      } = json;

      _model = model;
      this.data = data;
      this.target = target;
      this.features = features;
    },

    /**
     * Returns JSON representation of trained model
     */
    toJSON() {
      const { data, target, features } = this;
      const model = _model;

      return {
        model, data, target, features,
      };
    },
  };

  /**
   * Creates a new tree
   * @private
   */
  function createTree(data, target, features) {
    const targets = _.uniq(_.map(data, target));
    if (targets.length == 1) {
      return {
        type: NODE_TYPES.RESULT,
        val: targets[0],
        name: targets[0],
        alias: targets[0] + randomUUID(),
      };
    }

    if (features.length == 0) {
      const topTarget = mostCommon(targets);
      return {
        type: NODE_TYPES.RESULT,
        val: topTarget,
        name: topTarget,
        alias: topTarget + randomUUID(),
      };
    }

    const bestFeature = maxGain(data, target, features);
    const remainingFeatures = _.without(features, bestFeature);
    const possibleValues = _.uniq(_.map(data, bestFeature));

    const node = {
      name: bestFeature,
      alias: bestFeature + randomUUID(),
    };

    node.type = NODE_TYPES.FEATURE;
    node.vals = _.map(possibleValues, (v) => {
      const _newS = data.filter(x => x[bestFeature] == v);

      const child_node = {
        name: v,
        alias: v + randomUUID(),
        type: NODE_TYPES.FEATURE_VALUE,
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
    const uniqueVals = _.uniq(vals);
    const probs = uniqueVals.map(x => prob(x, vals));

    const logVals = probs.map(p => -p * log2(p));

    return logVals.reduce((a, b) => a + b, 0);
  }

  /**
   * Computes gain
   * @private
   */
  function gain(data, target, feature) {
    const attrVals = _.uniq(_.map(data, feature));
    const setEntropy = entropy(_.map(data, target));
    const setSize = _.size(data);

    const entropies = attrVals.map((n) => {
      const subset = data.filter(x => x[feature] === n);

      return (subset.length / setSize) * entropy(_.map(subset, target));
    });

    const sumOfEntropies = entropies.reduce((a, b) => a + b, 0);

    return setEntropy - sumOfEntropies;
  }

  /**
   * Computes Max gain across features to determine best split
   * @private
   */
  function maxGain(data, target, features) {
    return _.max(features, element => gain(data, target, element));
  }

  /**
   * Computes probability of of a given value existing in a given list
   * @private
   */
  function prob(value, list) {
    const occurrences = _.filter(list, element => element === value);

    const numOccurrences = occurrences.length;
    const numElements = list.length;
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
    const elementFrequencyMap = {};
    let largestFrequency = -1;
    let mostCommonElement = null;

    list.forEach((element) => {
      const elementFrequency = (elementFrequencyMap[element] || 0) + 1;
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
    return `_r${Math.random().toString(32).slice(2)}`;
  }

  /**
   * @class DecisionTreeID3
   */
  return DecisionTreeID3;
}());

'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _decisionTree = require('./decision-tree');

var _decisionTree2 = _interopRequireDefault(_decisionTree);

var _utilities = require('../utilities');

var _storage = require('../storage');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var TreeProto = {
    tree: null,
    className: '',
    features: [],
    persist: false,
    learn: false,
    fixMissingFeatures: false,
    debug: false,
    train: function train() {
        var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
        var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        this.debug && console.log("train method called");
        var className = config.className,
            features = config.features,
            fixMissingFeatures = config.fixMissingFeatures,
            persist = config.persist,
            learn = config.learn,
            debug = config.debug;

        this.className = (0, _utilities.isDefined)(className) && (0, _utilities.isNull)(className) ? className : this.className;
        this.features = (0, _utilities.isDefined)(features) && (0, _utilities.isArray)(features) && features.length ? features : this.features;
        this.persist = (0, _utilities.isDefined)(persist) ? persist : this.persist;
        this.learn = (0, _utilities.isDefined)(learn) ? learn : this.learn;
        this.debug = (0, _utilities.isDefined)(debug) ? debug : this.debug;
        this.fixMissingFeatures = (0, _utilities.isDefined)(fixMissingFeatures) ? fixMissingFeatures : this.fixMissingFeatures;

        this.debug && console.log("className: %s, features: %s , persist: %s, learn: %s", this.className, this.features, this.persist, this.learn);

        var trainingData = this.fixTrainingData(data);
        this.debug && console.log("Fixing training data");
        this.tree = new _decisionTree2.default(trainingData, this.className, this.features);

        this.debug && console.log("persist is set: %s", this.persist);
        if (this.persist) {
            this.debug && console.log("persisting model");
            (0, _storage.persistModel)(this.toJSON(), this.debug);
            this.debug && console.log("model persisted successfully");
        }
    },
    fixTrainingData: function fixTrainingData() {
        var _this = this;

        var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

        this.debug && console.log("fixMissingFeatures is set: %s", this.fixMissingFeatures);
        if (this.fixMissingFeatures) {
            return data.reduce(function (collector, d) {
                var keys = Object.keys(d);
                _this.features.map(function (feature) {
                    if (!feature.includes(keys)) {
                        d[feature] = '';
                    }
                });
                collector.push(d);
                return collector;
            }, []);
        } else {
            return data;
        }
    },
    evaluate: function evaluate() {
        var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        return !(0, _utilities.isNull)(this.tree) && !(0, _utilities.isEmpty)(data) ? this.tree.predict(data) : '';
    },
    predict: function predict() {
        var query = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var learn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

        if ((0, _utilities.isEmpty)(query)) {
            this.debug && console.log("Query is invalid");
            return null;
        }

        if (!(0, _utilities.isNull)(this.tree)) {
            var decision = !(0, _utilities.isNull)(this.tree) && !(0, _utilities.isEmpty)(query) ? this.tree.predict(query) : '';
            var retrain = this.learn || learn;
            this.debug && console.log("learning mode is: %s", learn);
            if (retrain) {
                var data = [].concat(_toConsumableArray(this.tree.data), [query]);
                this.train(data);
                return decision;
            } else {
                return decision;
            }
        } else {
            this.debug && console.log("Tree has been not initialized or untrained");
            return null;
        }
    },
    toJSON: function toJSON() {
        this.debug && console.log("Exporting Decision tree model");
        return !(0, _utilities.isNull)(this.tree) ? this.tree.toJSON() : {};
    },
    fromJSON: function fromJSON() {
        var trainedModel = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        var isModelValid = !(0, _utilities.isEmpty)(trainedModel);
        this.debug ? isModelValid ? console.log("Model is valid") : console.log("Model is valid or empty") : null;

        if (isModelValid) {
            this.tree = new _decisionTree2.default(trainedModel);
            this.className = this.tree.target;
            this.features = this.tree.features;
            this.debug && console.log("Model imported successfully");
        }
    }
};

function DecisionTree() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$data = _ref.data,
        data = _ref$data === undefined ? [] : _ref$data,
        _ref$className = _ref.className,
        className = _ref$className === undefined ? '' : _ref$className,
        _ref$features = _ref.features,
        features = _ref$features === undefined ? [] : _ref$features,
        _ref$fixMissingFeatur = _ref.fixMissingFeatures,
        fixMissingFeatures = _ref$fixMissingFeatur === undefined ? false : _ref$fixMissingFeatur,
        _ref$persist = _ref.persist,
        persist = _ref$persist === undefined ? false : _ref$persist,
        _ref$load = _ref.load,
        load = _ref$load === undefined ? false : _ref$load,
        _ref$learn = _ref.learn,
        learn = _ref$learn === undefined ? false : _ref$learn,
        _ref$debug = _ref.debug,
        debug = _ref$debug === undefined ? false : _ref$debug;

    debug && console.log("Data provided while initialization, so training the model right now");
    var tree = new _decisionTree2.default(data, className, features);
    TreeProto.tree = Object.create(tree);
    TreeProto.className = className;
    TreeProto.features = features;
    TreeProto.fixMissingFeatures = fixMissingFeatures;
    TreeProto.debug = debug;
    TreeProto.persist = persist;
    TreeProto.load = load;

    if ((0, _utilities.isArray)(data) && data.length) {
        TreeProto.train(data);
    }

    if (load) {
        debug && console.log("Load setting is set: %s", load);
        debug && console.log("Loading model from previously persisted snapshot");
        var trainedModel = (0, _storage.loadModel)(this.debug);
        TreeProto.fromJSON(trainedModel);
        debug && console.log("Import from snapshot complete");
    }

    return TreeProto;
}

exports.default = DecisionTree;
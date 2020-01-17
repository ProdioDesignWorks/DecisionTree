import Tree from './decision-tree';
import { isEmpty, isObject, isArray, isString, isDefined, isNull } from '../utilities';
import { persistModel, loadModel } from '../storage';

const TreeProto = {
    tree: null,
    className: '',
    features: [],
    persist: false,
    learn: false,
    load: false,
    fixMissingFeatures: false,
    debug: false,
    train(data = [], config = {}) {
        this.debug && console.log("train method called");
        const { className, features, fixMissingFeatures, persist, learn, debug } = config;
        this.className = isDefined(className) && !isNull(className) ? className : this.className;
        this.features = isDefined(features) && isArray(features) && features.length ? features : this.features;
        this.persist = isDefined(persist) ? persist : this.persist;
        this.learn = isDefined(learn) ? learn : this.learn;
        this.debug = isDefined(debug) ? debug : this.debug;
        this.fixMissingFeatures = isDefined(fixMissingFeatures) ? fixMissingFeatures : this.fixMissingFeatures;

        this.debug && console.log("className: %s, features: %s , persist: %s, learn: %s", this.className, this.features, this.persist, this.learn);

        const trainingData = this.fixTrainingData(data);
        this.debug && console.log("Fixing training data");
        this.tree = new Tree(trainingData, this.className, this.features);
        
        this.debug && console.log("persist is set: %s", this.persist);
        if (this.persist) {
            this.debug && console.log("persisting model");
            persistModel(this.toJSON(), this.debug);
            this.debug && console.log("model persisted successfully");
        }
    },
    fixTrainingData(data = []) {
        this.debug && console.log("fixMissingFeatures is set: %s", this.fixMissingFeatures);
        if (this.fixMissingFeatures) {
            return data.reduce(
                (collector, d) => {
                    const keys = Object.keys(d);
                    this.features.map(feature => {
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
    evaluate(data = {}) {
        return !isNull(this.tree) && !isEmpty(data) ? this.tree.predict(data) : '';
    },
    predict(query = {}, learn = false) {
        if (isEmpty(query)) {
            this.debug && console.log("Query is invalid");
            return null;
        }

        if (!isNull(this.tree)) {
            const decision = !isNull(this.tree) && !isEmpty(query) ? this.tree.predict(query) : '';
            const retrain = this.learn || learn;
            this.debug && console.log("learning mode is: %s", learn);
            if (retrain) {
                const data = [ ...this.tree.data, query];
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
    toJSON() {
        this.debug && console.log("Exporting Decision tree model");
        return !isNull(this.tree) ? this.tree.toJSON() : {};
    },
    fromJSON(trainedModel = {}) {
        const isModelValid = !isEmpty(trainedModel);
        this.debug 
            ? isModelValid 
                ? console.log("Model is valid")
                : console.log("Model is valid or empty")
            : null;

        if (isModelValid) {
            this.tree = new Tree(trainedModel);
            this.className = this.tree.target;
            this.features = this.tree.features;
            this.debug && console.log("Model imported successfully");
        }
    }
};

function DecisionTree(config = {}) {
    const { 
        data = [], className = '', features = [], fixMissingFeatures = false, 
        persist = false, load = false, learn = false, debug = false
    } = config;
    debug && console.log("Data provided while initialization, so training the model right now");
    const tree = new Tree(data, className, features);
    TreeProto.tree = Object.create(tree);
    TreeProto.className = className;
    TreeProto.features = features;
    TreeProto.fixMissingFeatures = fixMissingFeatures;
    TreeProto.debug = debug;
    TreeProto.persist = persist;
    TreeProto.load = load;

    // if (isArray(data) && data.length) {
    //     TreeProto.train(data);
    // }

    if (load) {
        debug && console.log("Load setting is set: %s", load);
        debug && console.log("Loading model from previously persisted snapshot");
        const trainedModel = loadModel(this.debug);
        TreeProto.fromJSON(trainedModel);
        debug && console.log("Import from snapshot complete");
    }

    return TreeProto;
}

export default DecisionTree;
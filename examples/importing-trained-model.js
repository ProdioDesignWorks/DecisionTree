const { Tree } = require('../index.js');
const { trainingDataSet } = require('../data');
const config = {
	data: trainingDataSet,
	className: 'activity', 
	features: [ 'nrt', 'smokerType', 'willingness', 'dosageReduced', 'carvings', 'trigger' ],
	debug: false,
	persist: true, // Persists the model in local disk,
   learn: false, // If set the trains the tree for passed sample data
};
const sample = {
   "nrt":true,
   "smokerType":"HEAVY",
   "willingness":false,
   "dosageReduced":false,
   "carvings":"HIGH",
   "trigger":"SOCIAL",
   "activity":"A19"
};

console.log("Prediction using trained decision tree");
const DecisionTree = new Tree(config);

console.log("Prediction result:", DecisionTree.predict(sample));

console.log("Exporting the model");
const modelJson = DecisionTree.toJSON();

console.log("Initializing a blank empty tree");
const UnTrainedDecisionTree = new Tree();

console.log("Prediction using untrained decision tree");
console.log("Prediction result:", UnTrainedDecisionTree.predict(sample));

console.log("Importing trained exported model in untrained decision tree");
UnTrainedDecisionTree.fromJSON(modelJson);
console.log("Now, Prediction using untrained decision tree");
console.log("Prediction result:", UnTrainedDecisionTree.predict(sample));


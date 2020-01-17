const { Tree } = require('../index.js');
const { trainingDataSet } = require('../data');
const config = { 
	data: trainingDataSet,
	className: 'activity', 
	features: [ 'nrt', 'smokerType', 'willingness', 'dosageReduced', 'carvings', 'trigger' ],
	debug: false,
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

const DecisionTree = new Tree(config);

console.log("Training data was passed to decision tree, while initializing.");
console.log("It has been trained, no need to train it separately.")
console.log("Prediction is supposed to be A19");
console.log("Prediction result:", DecisionTree.predict(sample));


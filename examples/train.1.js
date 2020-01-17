const { Tree } = require('../index.js');
const DecisionTree = new Tree();
const { randomTrainingDataSet } = require('../data');
const config = { 
	className: 'activity', 
	features: [ 'nrt', 'smokerType', 'willingness', 'dosageReduced', 'carvings', 'trigger' ],
	debug: false,
};
const sample = {
   "nrt": true,
   "smokerType": "HEAVY",
   "willingness": false,
   "dosageReduced": false,
   "carvings": "HIGH",
   "trigger": "SOCIAL",
   "activity": "A19"
};

console.log("Predicting without training...");
console.log("Prediction result:", DecisionTree.predict(sample));

console.log("Now, training the model...");
DecisionTree.train(randomTrainingDataSet, config);
console.log("Training complete...");
console.log("Prediction is supposed to be A19");
console.log("Prediction result:", DecisionTree.predict(sample));


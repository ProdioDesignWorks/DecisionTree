# DecisionTree
NodeJS Implementation of Decision Tree using ID3 Algorithm. Base decision tree based on [this github repo.](https://github.com/serendipious/nodejs-decision-tree-id3)

[![Build Status](https://travis-ci.org/joemccann/dillinger.svg?branch=master)](https://travis-ci.org/joemccann/dillinger)

Features:

  - Simple APIs
  - Debug mode
  - Inbuilt persist model capability
  - Highly configurable
  - Trained model can be imported/exported easily

### Installation

Dillinger requires [Node.js](https://nodejs.org/) v6+ to run.

```sh
$ npm install js-decisiontree --save
```

### How to use
```js
const { Tree } = require('js-decisiontree');
const trainingDataSet = [];
const config = {};
const DecisionTree = new Tree(config);
DecisionTree.train(trainingDataSet, config);
DecisionTree.predict(sample);
```
### Configuration settings

| Setting | Description |
| ------ | ------ |
| className | Class name or property which will be used as output of decision tree|
| features | Features or data points to be used for while decision tree |
| persist | If set, persists the trained model on local disk |
| learn | If set, trains the model with data used for prediction |
| fixMissingFeatures | If set, takes careof of missing features in training data |
| debug | If set, logs the internal activity to terminal |
| load | If set, loads previously stored model to local disk. This setting is only significant while intializing the tree |

### APIs

| Setting | Description |
| ------ | ------ |
| train | Training the decision tree|
| predict | Prediciting the results |
| toJSON | Export the trained model as JSON |
| fromJSON | Import an already trained JSON model exported using .toJSON() API |

# Examples
 Refer examples for exhautive examples
```js
const DecisionTree = new Tree();
const trainingDataSet = [
    {"color":"blue", "shape":"square", "liked":false},
  	{"color":"red", "shape":"square", "liked":false},
  	{"color":"blue", "shape":"circle", "liked":true},
  	{"color":"red", "shape":"circle", "liked":true},
  	{"color":"blue", "shape":"hexagon", "liked":false},
  	{"color":"red", "shape":"hexagon", "liked":false},
  	{"color":"yellow", "shape":"hexagon", "liked":true},
  	{"color":"yellow", "shape":"circle", "liked":true}
];
const config = {
    className: 'liked',
    features: [ 'color', 'shape' ],
};
const sample = {"color":"blue", "shape":"hexagon", "liked":false }; 
DecisionTree.train(trainingDataSet, config);
const prediction = DecisionTree.predict(sample);
console.log("prediction:", prediction); // false
```

License
----

MIT


**Free Software, Hell Yeah!**

'use strict';var _=require('lodash');/**
 * ID3 Decision Tree Algorithm
 * @module DecisionTreeID3
 */module.exports=function(){/**
   * @constructor
   * @return {DecisionTreeID3}
   */function a(a,c,d){switch(arguments.length){case 1:this.import(arguments[0]);break;case 3:this.data=a,this.target=c,this.features=d,k=b(a,c,d);break;default:throw new Error('Invalid arguments passed to constructor. Check documentation on usage');}}/**
   * @public API
   *//**
   * Creates a new tree
   * @private
   */function b(a,c,d){var f=_.uniq(_.map(a,c));if(1==f.length)return{type:j.RESULT,val:f[0],name:f[0],alias:f[0]+i()};if(0==d.length){var n=h(f);return{type:j.RESULT,val:n,name:n,alias:n+i()}}var g=e(a,c,d),k=_.without(d,g),l=_.uniq(_.map(a,g)),m={name:g,alias:g+i()};return m.type=j.FEATURE,m.vals=_.map(l,function(d){var e=a.filter(function(a){return a[g]==d}),f={name:d,alias:d+i(),type:j.FEATURE_VALUE};return f.child=b(e,c,k),f}),m}/**
   * Computes entropy of a list
   * @private
   */function c(a){var b=_.uniq(a),c=b.map(function(b){return f(b,a)}),d=c.map(function(a){return-a*g(a)});return d.reduce(function(c,a){return c+a},0)}/**
   * Computes gain
   * @private
   */function d(a,b,d){var e=_.uniq(_.map(a,d)),f=c(_.map(a,b)),g=_.size(a),h=e.map(function(e){var f=a.filter(function(a){return a[d]===e});return f.length/g*c(_.map(f,b))}),i=h.reduce(function(c,a){return c+a},0);return f-i}/**
   * Computes Max gain across features to determine best split
   * @private
   */function e(a,b,c){return _.max(c,function(c){return d(a,b,c)})}/**
   * Computes probability of of a given value existing in a given list
   * @private
   */function f(a,b){var c=_.filter(b,function(b){return b===a}),d=c.length,e=b.length;return d/e}/**
   * Computes Log with base-2
   * @private
   */function g(a){return Math.log(a)/Math.log(2)}/**
   * Finds element with highest occurrence in a list
   * @private
   */function h(a){var b={},c=-1,d=null;return a.forEach(function(a){var e=(b[a]||0)+1;b[a]=e,c<e&&(d=a,c=e)}),d}/**
   * Generates random UUID
   * @private
   */function i(){return'_r'+Math.random().toString(32).slice(2)}/**
   * @class DecisionTreeID3
   *//**
   * Map of valid tree node types
   * @constant
   * @static
   */var j=a.NODE_TYPES={RESULT:'result',FEATURE:'feature',FEATURE_VALUE:'feature_value'},k=void 0;/**
   * Underlying model
   * @private
   */return a.prototype={/**
     * Predicts class for sample
     */predict:function d(a){for(var b=k,c=function(){var c=b.name,d=a[c],e=_.find(b.vals,function(a){return a.name==d});b=e?e.child:b.vals[0].child};b.type!==j.RESULT;)c();return b.val},/**
     * Evalutes prediction accuracy on samples
     */evaluate:function f(a){var b=this,c=this.target,d=0,e=0;return _.each(a,function(a){d++;var f=b.predict(a),g=a[c];_.isEqual(f,g)&&e++}),e/d},/**
     * Imports a previously saved model with the toJSON() method
     */import:function f(a){var b=a.model,c=a.data,d=a.target,e=a.features;k=b,this.data=c,this.target=d,this.features=e},/**
     * Returns JSON representation of trained model
     */toJSON:function e(){var a=this.data,b=this.target,c=this.features,d=k;return{model:d,data:a,target:b,features:c}}},a}();
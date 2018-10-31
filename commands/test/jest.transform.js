const build = require('../build');

const options = build.options();

// TODO: debug options - current left in to track down compiler bug
console.log("Build options", options);

module.exports = require('babel-jest').createTransformer(options);
const build = require('../build');

const options = build.options();

module.exports = require('babel-jest').createTransformer(options);
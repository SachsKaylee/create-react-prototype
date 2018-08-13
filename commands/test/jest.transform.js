const babel = require('../build/babel.config');

module.exports = require('babel-jest').createTransformer(babel);
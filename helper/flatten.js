const flatten = list => list.reduce((acc, e) => Array.isArray(e) ? [...acc, ...flatten(e)] : [...acc, e], []);

module.exports = flatten;
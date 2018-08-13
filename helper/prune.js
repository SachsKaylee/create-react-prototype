const prune = list => list.reduce((accumulator, value) => value ? [...accumulator, value] : accumulator, []);

module.exports = prune;
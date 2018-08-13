const wait = (time = 250) => new Promise(res => setTimeout(res, time));

module.exports = wait;
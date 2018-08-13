const stringify = (arg) => Array.isArray(arg) ? arg.join(", ") : typeof arg === "string" ? arg : "" + arg;
const format = (str, args) => args ? Object.keys(args).reduce((str, arg) => str.replace(new RegExp(`\\[${arg}\\]`, 'gi'), stringify(args[arg])), str) : str;

module.exports = format;
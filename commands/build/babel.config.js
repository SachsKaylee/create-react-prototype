const pruneList = require("../../helper/prune");
const path = require("path");

// We need to use absolute paths, otherwise babel with try to resolve the plugins in the user directory when using jest.
//    todo: find a way to fix this, somehow make babel look into the user & our directory for deps.
const resolve = mod => path.join(__dirname, "../../node_modules", mod);

const { BABEL_ENV, NODE_ENV } = process.env;

console.log("Running Babel in " + NODE_ENV + " mode for " + BABEL_ENV + " modules...");

const alwaysUse = value => value;
const useOnlyIn = (value, { system, node }) => {
  if (system && system !== BABEL_ENV) return null;
  if (node && node !== NODE_ENV) return null;
  return value;
};
const dontUseIn = (value, { system, node }) => {
  if (system && system !== BABEL_ENV) return value;
  if (node && node !== NODE_ENV) return value;
  return null;
};

// For the ES configuration only transpile react to valid JavaScript.
// For commonjs transpile to old JS versions.
const presets = pruneList([
  dontUseIn([resolve('@babel/preset-env'), {
    targets: {
      ie: 11,
      edge: 14,
      firefox: 45,
      chrome: 49,
      safari: 10,
      node: '6.11',
    },
    modules: BABEL_ENV,
  }], { system: "es" }),
  alwaysUse(resolve('@babel/preset-react'))
]);

// The ES system does not polyfill etc, while the others do.
const transformOptions = BABEL_ENV === "es"
  ? { helpers: true, useESModules: true }
  : { helpers: true, useESModules: false };

const plugins = pruneList([
  alwaysUse(resolve('@babel/plugin-proposal-object-rest-spread')),
  alwaysUse([resolve('@babel/plugin-transform-runtime'), transformOptions]),
  dontUseIn(resolve('@babel/plugin-transform-object-assign'), { system: "es" }),
  useOnlyIn(resolve("babel-plugin-transform-react-constant-elements"), { mode: "production" })
]);

const ignore = pruneList([
  alwaysUse('scripts/*.js'),
  useOnlyIn("**/*.test.js", { mode: "test" })
]);

const config = { 
  plugins, 
  presets, 
  ignore 
};

module.exports = config;
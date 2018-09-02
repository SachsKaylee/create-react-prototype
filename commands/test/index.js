const path = require("path");
const prune = require("../../helper/prune");
const flatten = require("../../helper/flatten");
const jest = require("jest");

const bootstrap = (app) => {
  app
    .command("test", "Runs the full test suite of your library.")
    .option("-w --watch", "Watches the unit tests (git mode)")
    .option("--watchAll", "Watches the unit tests (no git mode)")
    .option("-d --debug", "Runs jest in debug mode")
    .action(async (args, callback) => {
      process.env.NODE_ENV = "test";

      console.log("📚 Running unit tests ...");
      await runTests(args.options);

      console.log("✨ Success! Your library has been tested.");

      callback();
    });
};

const runTests = async (args) => {
  const cfgFile = path.join(__dirname, "./jest.config.js");
  const cfg = flatten(prune([
    ["--config", cfgFile],
    args.watch && ["--watch"],
    args.watchAll && ["--watchAll"],
    args.debug && ["--debug"]
  ]));
  await jest.run(cfg);
};

module.exports = {
  bootstrap
};
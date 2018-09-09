const paths = require("../../helper/paths");
const pm = require("../../helper/pm");
const build = require("../build");

const bootstrap = (app) => {
  app
    .command("publish", "Publishes your library to NPM! Things are about to get serious!")
    .action(async (args, callback) => {
      process.env.NODE_ENV = "production";

      console.log("📚 Creating a full build before publishing ...");
      await build.runFullBuild();

      console.log("📚 Publishing your library ...");
      console.log("Distribution Path:", paths.getDistFolder());
      await pm.publish();

      console.log("✨ Success! Your library has published to NPM.");

      callback();
    });
};

module.exports = {
  bootstrap
};
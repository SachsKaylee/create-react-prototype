const paths = require("../../helper/paths");
const pm = require("../../helper/pm");
const build = require("../build");

const bootstrap = (app) => {
  app
    .command("pack", "Packs your library into a .tgz file that you can install locally for testing.")
    .action(async (args, callback) => {
      process.env.NODE_ENV = process.env.NODE_ENV || "production";

      console.log("📚 Creating a full build before packing ...");
      await build.runFullBuild();

      console.log("📚 Packing your library ...");
      console.log("Distribution Path:", paths.getDistFolder());
      await pm.pack();

      console.log("✨ Success! Your library has been packed into a .tgz file.");

      callback();
    });
};

module.exports = {
  bootstrap
};

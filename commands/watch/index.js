const build = require("../build");

const bootstrap = (app) => {
  app
    .command("watch", "Watches your library code and keeps building a development version.")
    .action(async (args, callback) => {

      console.log("📚 Cleaning previous build output ...");
      await build.cleanPreviousBuildOutput();

      console.log("📚 Watching your code ...");
      process.env.NODE_ENV = "development";
      process.env.BABEL_ENV = "commonjs";
      await build.createPackageJson(false);
      await build.runBuild(true);

      console.log("✨ Success! Your library finished watching.");

      callback();
    });
};

module.exports = {
  bootstrap
};
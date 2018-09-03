const run = require("../../helper/run");
const path = require("path");
const build = require("../build");

const bootstrap = (app) => {
  app
    .command("release", "Publishes your library to NPM! Things are about to get serious!")
    .action(async (args, callback) => {
      process.env.NODE_ENV = "production";

      console.log("📚 Creating a full build before publishing ...");
      await build.runFullBuild();

      console.log("📚 Publishing your library ...")
      await runPublish();

      console.log("✨ Success! Your library has published to NPM.");

      callback();
    });
};

const runPublish = async () => {
  const cwd = process.cwd();
  const dist = path.join(cwd, "./dist");
  console.log("Distribution Path:", dist);
  await run("npm", ["publish", dist]);
};

module.exports = {
  bootstrap,
  runPublish
};
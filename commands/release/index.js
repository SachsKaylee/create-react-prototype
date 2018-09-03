const run = require("../../helper/run");
const path = require("path");
const build = require("../build");

const bootstrap = (app) => {
  app
    .command("release", "Publishes your library to NPM! Things are about to get serious!")
    .action(async (args, callback) => {
      process.env.NODE_ENV = "production";

      console.log("📚 Creating a full build before releasing ...");
      await build.runFullBuild();

      console.log("📚 Releasing your library ...")
      await runRelease();

      console.log("✨ Success! Your library has released on NPM.");

      callback();
    });
};

const runRelease = async () => {
  const cwd = process.cwd();
  const dist = path.join(cwd, "./dist");
  console.log("Distribution Path:", dist);
  await run("npm", ["release", dist]);
};

module.exports = {
  bootstrap,
  runRelease
};
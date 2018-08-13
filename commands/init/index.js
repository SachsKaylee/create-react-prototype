const fs = require("fs-extra");
const path = require("path");
//onst wait = require("../../helper/wait");
const scaffolding = require("./scaffolding");
const run = require("../../helper/run");

const bootstrap = (app) => {
  app
    .command("init", "Creates a new react library")
    .action(async (args, callback) => {
      const dir = process.cwd();
      try {
        //await fs.emptyDir(dir);
        console.log("📚 Welcome to create-react-prototype. Let's get started with setting up your package.json ...")
        await npmInit();

        console.log("📚 Nice! Now we'll shove some of our configuration into your package.json ...")
        await adjustPackageJson();

        console.log("📚 We will now set up your project with some default files ...")
        await scaffolding.copyScaffolding();

        console.log("✨ Created a new React library in '" + dir + "' -- Happy coding!")
      } catch (e) {
        app.log("Error", e.name);
        app.log("Message", e.message);
        app.log("Stack", e.stack);
      }
      callback();
    });
};

const npmInit = async () => {
  return await run('npm', ["init"]);
};

const adjustPackageJson = async () => {
  const cwd = process.cwd();
  const packageJsonPath = path.join(cwd, "./package.json");
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath));

  // Update the JSON
  packageJson["scripts"] = {
    "build": "create-react-prototype build && npm run test",
    "test": "create-react-prototype test",
    "release": "npm run build && create-react-prototype release",
    "pack": "npm run build && create-react-prototype pack"
  };
  packageJson["generator"] = "create-react-prototype";
  packageJson["main"] = "./src/index.js";

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  return Promise.resolve();
};

module.exports = {
  bootstrap
};
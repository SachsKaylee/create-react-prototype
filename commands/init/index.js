const fs = require("fs-extra");
const path = require("path");
const run = require("../../helper/run");
const paths = require("../../helper/paths");
const format = require("../../helper/format-unicorn");
const getLicense = require("./get-license");

const bootstrap = (app) => {
  app
    .command("init", "Creates a new react library")
    .action(async (args, callback) => {
      const dir = process.cwd();
      try {
        //await fs.emptyDir(dir);
        console.log("📚 Welcome to create-react-prototype. Let's get started with setting up your package.json ...");
        console.log("📚 Tip: Fill it out properly, we'll read it and assume you entered correct data!");
        await npmInit();

        console.log("📚 Nice! Now we'll shove some of our configuration into your package.json ...");
        await adjustPackageJson();

        console.log("📚 We will now set up your project with some default files ...");
        await copyScaffolding();

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
  const packageJsonPath = path.join(paths.getProjectFolder(), "./package.json");
  const packageJson = JSON.parse(await fs.readFile(packageJsonPath));

  // Update the JSON
  packageJson["scripts"] = {
    "build": "create-react-prototype build && npm run test",
    "test": "create-react-prototype test",
    "release": "npm run build && create-react-prototype release",
    "pack": "npm run build && create-react-prototype pack"
  };
  packageJson["generator"] = "create-react-prototype";
  packageJson["main"] = "./src/index.js";

  await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2));
};

const getFileArgs = async () => {
  const packageJsonPath = path.join(paths.getProjectFolder(), "./package.json");
  const packageJson = JSON.parse(await fs.readFile(packageJsonPath));
  const year = new Date().getFullYear();
  const { description, name, version, license, author: fullname } = packageJson;

  return {
    description, name, version, year, license, fullname
  };
}

const copyScaffolding = async () => {
  const args = await getFileArgs();
  await createLicense(args);
  await copyFile("./README.md", args);
  await copyFile("./CHANGELOG.md", args);
};

const createLicense = async (args) => {
  let licenseText;
  try {
    licenseText = await getLicense(args.license);
  } catch {
    console.log("Could not get license text for license '" + args.license + "'. Make sure to manually update your LICENSE file!");
    licenseText = (await fs.readFile(path.join(__dirname, "./LICENSE"))).toString();
  }
  licenseText = format(licenseText, args);
  console.log("Created:", "./LICENSE");
  await fs.writeFile(path.join(paths.getProjectFolder(), "./LICENSE"), licenseText);
};

const copyFile = async (file, args) => {
  const filePath = path.join(__dirname, file);
  const contents = (await fs.readFile(filePath)).toString();
  const formatted = format(contents, args);
  const srcFilePath = path.join(paths.getProjectFolder(), file);
  console.log("Created:", file);
  await fs.writeFile(srcFilePath, formatted);
}

module.exports = {
  bootstrap
};
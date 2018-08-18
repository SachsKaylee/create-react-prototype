const fs = require("fs-extra");
const path = require("path");
const run = require("../../helper/run");
const paths = require("../../helper/paths");
const format = require("../../helper/format-unicorn");
const getLicense = require("./get-license");
const myPackageJson = require("../../package.json");

const bootstrap = (app) => {
  app
    .command("init", "Creates a new react library")
    .option("--noDependency", "Does not add create-react-prototype as a dev dependency.")
    .action(async (args, callback) => {
      const dir = process.cwd();
      //try {
      //await fs.emptyDir(dir);
      console.log("📚 Welcome to create-react-prototype. Let's get started with setting up your package.json ...");
      console.log("📚 Tip: Fill it out properly, we'll read it and assume you entered correct data!");
      await npmInit();

      console.log("📚 Nice! Now we'll shove some of our configuration into your package.json ...");
      await adjustPackageJson(args.options);

      console.log("📚 We will now set up your project with some default files ...");
      await copyScaffolding();

      /*console.log("📚 Creating your example project ...");
      await createExample();*/
      console.log("📚 Installing ...");
      await install();

      console.log("✨ Created a new React library in '" + dir + "' -- Happy coding!")
      /* } catch (e) {
         app.log("Error", e.name);
         app.log("Message", e.message);
         app.log("Stack", e.stack);
       }*/
      callback();
    });
};

const npmInit = async () => {
  return await run('npm', ["init"]);
};

const install = async () => {
  await run('npm', ["install"]);
  const exampleDir = path.join(paths.getProjectFolder(), "./example");
  if (!await fs.exists(exampleDir)) {
    await fs.mkdir(exampleDir);
  }
  await run('npm', ["install"], { stdio: "inherit", cwd: exampleDir });
};

/*const createExample = async () => {
  const craPath = path.join(__dirname, "../../node_modules/.bin/create-react-app")
  return await run(craPath, ["example"]);
};*/

const adjustPackageJson = async (options = {}) => {
  const packageJsonPath = path.join(paths.getProjectFolder(), "./package.json");
  const packageJson = JSON.parse(await fs.readFile(packageJsonPath));

  // Update the JSON
  packageJson["scripts"] = {
    "build": "create-react-prototype build && npm run test",
    "watch": "concurrently --kill-others \"create-react-prototype watch\" \"npm run test\"",
    "test": "create-react-prototype test",
    "release": "npm run build && create-react-prototype release",
    "pack": "npm run build && create-react-prototype pack"
  };
  packageJson["generator"] = "create-react-prototype";
  packageJson["main"] = "./src/index.js";
  packageJson["dependencies"] = {
    ...(packageJson["dependencies"] || {}),
    "@babel/runtime": "^7.0.0-rc.1"
  };;
  packageJson["devDependencies"] = {
    ...(packageJson["devDependencies"] || {}),
    "concurrently": "^3.6.1",
    ...(options.noDependency ? {} : { "create-react-prototype": "^" + myPackageJson.version })
  };

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
};

const copyScaffolding = async () => {
  const args = await getFileArgs();
  await createLicense(args);
  await copyFile("./README.md", args);
  await copyFile("./CHANGELOG.md", args);
  await copyExample(args);
};

const copyExample = async (args) => {
  if (!await fs.exists(path.join(paths.getProjectFolder(), "./example"))) {
    console.log("./example directory already exists, not copying examples.");
  } else {
    await copyDirectory("./example", args);
  }
}

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
};

const copyDirectory = async (dir, args) => {
  const srcDir = path.join(paths.getProjectFolder(), dir);
  if (!await fs.exists(srcDir)) {
    await fs.mkdir(srcDir);
  }
  const contents = await fs.readdir(path.join(__dirname, dir));
  const promises = contents.map(async content => {
    const stats = await fs.lstat(path.join(__dirname, dir, content));
    const rel = path.join(dir, content);
    if (stats.isDirectory()) {
      await copyDirectory(rel, args);
    } else {
      await copyFile(rel, args);
    }
  });
  await Promise.all(promises);
};

module.exports = {
  bootstrap
};
const fs = require("fs-extra");
const path = require("path");
const run = require("../../helper/run");
const paths = require("../../helper/paths");
const format = require("../../helper/format-unicorn");
const getLicense = require("./get-license");
const build = require("../build");
const myPackageJson = require("../../package.json");

const bootstrap = (app) => {
  app
    .command("init", "Creates a new react library")
    .option("-D --dependency <dependency>", "Possible values: npm/local/retain/none - Decides on how to add create-react-prototype as a dependency.")
    .action(async (args, callback) => {
      // Set default options
      process.env.NODE_ENV = process.env.NODE_ENV || "development";
      args.options.dependency = args.options.dependency || "npm";

      console.log("📚 Welcome to create-react-prototype. Let's get started with setting up your package.json ...");
      console.log("📚 Tip: Fill it out properly, we'll read it and assume you entered correct data!");
      await npmInit();

      console.log("📚 Nice! Now we'll shove some of our configuration into your package.json ...");
      await adjustPackageJson(args.options);

      console.log("📚 We will now set up your project with some default files ...");
      await copyScaffolding();

      console.log("📚 Installing library ...");
      await run('npm', ["install"]);

      console.log("📚 Creating initial build ...");
      await build.runFullBuild();

      console.log("📚 Installing example ...");
      const exampleDir = path.join(paths.getProjectFolder(), "./example");
      /*if (!await fs.exists(exampleDir)) {
        await fs.mkdir(exampleDir);
      }*/
      await run('npm', ["install"], { stdio: "inherit", cwd: exampleDir });

      console.log("✨ Created a new React library in '" + process.cwd() + "' -- Happy coding!")
      callback();
    });
};

const npmInit = async () => {
  return await run('npm', ["init"]);
};

const adjustPackageJson = async (options = {}) => {
  const packageJsonPath = path.join(paths.getProjectFolder(), "./package.json");
  const packageJson = JSON.parse(await fs.readFile(packageJsonPath));

  let myDependency;
  switch (options.dependency) {
    case "npm": {
      myDependency = "^" + myPackageJson.version;
      break;
    }
    case "local": {
      const filePath = path.relative(paths.getProjectFolder(), paths.getMyFolder());
      myDependency = "file:" + filePath;
      break;
    }
    case "none": {
      myDependency = undefined;
      break;
    }
    case "retain": {
      myDependency = packageJson.devDependencies && packageJson.devDependencies["create-react-prototype"];
      break;
    }
    default: {
      throw new Error(`Unknown dependency mode '${options.dependency}'.`);
    }
  }

  // Update the JSON
  packageJson.scripts = packageJson.scripts || {};
  packageJson.scripts["build"] = "create-react-prototype build";
  packageJson.scripts["watch"] = "create-react-prototype watch";
  packageJson.scripts["test"] = "create-react-prototype test";
  packageJson.scripts["release"] = "create-react-prototype release";
  packageJson.scripts["pack"] = "create-react-prototype pack";
  packageJson.generator = "create-react-prototype";
  packageJson.main = "./src/index.js";

  packageJson.dependencies = packageJson.dependencies || {};
  packageJson.dependencies["@babel/runtime"] = packageJson.dependencies["@babel/runtime"] || "^7.0.0-rc.1";

  packageJson.devDependencies = packageJson.devDependencies || {};
  packageJson.devDependencies["create-react-prototype"] = myDependency;
  packageJson.devDependencies["react"] = packageJson.devDependencies["react"] || "^16.2.0"
  packageJson.devDependencies["react-dom"] = packageJson.devDependencies["react-dom"] || "^16.2.0"

  packageJson.peerDependencies = packageJson.peerDependencies || {};
  packageJson.peerDependencies["react"] = packageJson.peerDependencies["react"] || ">=16.2.0"
  packageJson.peerDependencies["react-dom"] = packageJson.peerDependencies["react-dom"] || ">=16.2.0"

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
  if (!await fs.exists(paths.getSourceFolder())) {
    await fs.mkdir(paths.getSourceFolder());
    await fs.writeFile(path.join(paths.getSourceFolder(), "./index.js"), format(`
import * as React from "react";

// This is a default index file created by create-react-prototype.
// To get started follw these steps:
//  $ npm run watch
//  $ cd example
//  $ npm run start
// Now your browser will open, and any changes you make to this file (or others) will be reloaded in real time!

// You may also want to take a look at /example/src/App.js to create a better playground for your library.

export default () => (<span>Welcome to <em>[name]</em>!</span>);
`, args));
  }
  await createLicense(args);
  await createGitignore(args);
  await copyFile("./README.md", args);
  await copyFile("./CHANGELOG.md", args);
  await copyExample(args);
};

const copyExample = async (args) => {
  if (await fs.exists(paths.getExampleFolder())) {
    console.log("Example directory already exists, not copying examples.");
  } else {
    const exampleRelativePath = path.relative(paths.getProjectFolder(), paths.getExampleFolder());
    await copyDirectory(exampleRelativePath, args);
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

const createGitignore = async (args) => {
  const srcFilePath = path.join(paths.getProjectFolder(), ".gitignore");
  if (!await fs.exists(srcFilePath)) {
    console.log("Created:", "./.gitignore");
    await fs.writeFile(srcFilePath, format(`# Default create-react-prototype .gitignore for [name]
node_modules/
dist/
*.tgz
`, args));
  }
}

const copyFile = async (file, args) => {
  const srcFilePath = path.join(paths.getProjectFolder(), file);
  if (!await fs.exists(srcFilePath)) {
    const filePath = path.join(__dirname, file);
    const contents = (await fs.readFile(filePath)).toString();
    const formatted = format(contents, args);
    console.log("Created:", file);
    await fs.writeFile(srcFilePath, formatted);
  }
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
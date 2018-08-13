const path = require("path");

const getProjectFolder = () => {
  const project = process.cwd();
  return project;
};

const getSourceFolder = () => {
  const project = getProjectFolder();
  const src = path.join(project, "./src");
  return src;
};

const getDistFolder = () => {
  const cwd = process.cwd();
  const dist = process.env.BABEL_ENV === "commonjs"
    ? path.join(cwd, "./dist")
    : path.join(cwd, "./dist/", process.env.BABEL_ENV);
  return dist;
};

module.exports = {
  getProjectFolder,
  getSourceFolder,
  getDistFolder
};
const path = require("path");

const getMyFolder = () => {
  const my = path.resolve(__dirname, "../");
  return my;
};

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
  return path.join(cwd, "./dist");
};

getExampleFolder = () => {
  return path.join(getProjectFolder(), "./example");
};

module.exports = {
  getMyFolder,

  getProjectFolder,
  getSourceFolder,
  getDistFolder,
  getExampleFolder
};
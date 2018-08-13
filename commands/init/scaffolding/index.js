
const copyScaffolding = async () => {
  const cwd = process.cwd();
  const dir = __dirname;
  console.log({cwd, dir})
  return Promise.resolve();
};

module.exports = {
  copyScaffolding
};
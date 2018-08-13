const spawn = require('cross-spawn');

const run = async (command, args) => {
  const child = spawn.sync(command, args, { stdio: 'inherit' });
  const stderr = child.stderr ? child.stderr.toString().trim() : "";
  const stdio = child.stdio ? child.stdio.toString().trim() : "";
  if (child.error) throw new Error(child.error);
  if (stderr) throw new Error(stderr);
  return Promise.resolve(stdio);
};

module.exports = run;
const bootstrap = (app) => {
  app
    .command("release", "Publishes your library to NPM! Things are about to get serious!")
    .action((args, callback) => {
      app.log("released on npm!", args)
      // todo: read package json and read "private" flag -> if true, abort!
      callback();
    });
};

module.exports = {
  bootstrap
};
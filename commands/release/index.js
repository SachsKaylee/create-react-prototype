const bootstrap = (app) => {
  app
    .command("release", "Publishes your library to NPM! Things are about to get serious!")
    .action((args, callback) => {
      app.log("released on npm!", args)
      callback();
    });
};

module.exports = {
  bootstrap
};
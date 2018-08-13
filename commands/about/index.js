const bootstrap = (app) => {
  app
    .command("about", "Who made this CLI possible?")
    .action((args, callback) => {
      app.log("Me, You and some other people.", args)
      callback();
    });
};

module.exports = {
  bootstrap
};
module.exports = {
  includeByPath: [__dirname + '/services'],
  configs: [__dirname + '/config.one.json', __dirname + '/config.two.json'],
  logging: false,
  stubAll: false,
  stub: {
    serviceOne: false,
    serviceTwo: true,
    serviceThree: {
      publicMethodOne: function (value) { return value + 1; }
    }
  }
};

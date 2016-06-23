module.exports = {
  includeByPath: ['../../services'],
  excludeByName: ['name-of-a-service'],
  configs: ['./config.one.json', './config.two.json'],
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

module.exports = {
  includeByPath: ['../../services'],
  excludeByName: ['name-of-a-service'],
  configs: ['./low.json', 'mid.json', 'top.json'],
  stubAll: false,
  stub: {
    serviceOne: false,
    serviceTwo: true,
    serviceThree: {
      publicMethodOne: function (value) { return value + 1; }
    }
  }
};

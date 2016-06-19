module.exports: {
  includeByPath: ['../../services'],
  excludeByName: ['name-of-a-service'],
  applyConfigs: ['./low.json', 'mid.json', 'top.json'],
  stubAll: false,
  stubSpecific: {
    serviceOne: false,
    serviceTwo: true,
    serviceThree: {
      publicMethodOne: function (value) { return value + 1; }
    }
  }
};

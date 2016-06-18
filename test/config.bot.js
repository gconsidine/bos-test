module.exports: {
  includeLocal: true,
  includeNative: true,
  includeByPath: ['../../services'],
  excludeByName: ['name-of-a-service'],
  logging: false,
  stub: false,
  stubSpecific: {
    serviceOne: false,
    serviceTwo: true,
    serviceThree: {
      publicMethodOne: function (value) { return value + 1; }
    }
  }
};

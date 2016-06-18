var assert = require('assert'),
    util = require('../../lib/inject');

describe('loader | native', function () {
    it('should callback success if no services are provided to load', function (done) {
        util.inject(null, { logger: { colors: { info: 'pink' } } }, function (error, services) {
            console.log(services);
            //assert.equal(logger, loggerService);
            done();
        });
    });
});


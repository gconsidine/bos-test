var assert = require('assert'),
    bos = require('../../index');

describe('API', function () {

    it('should apply configuration on top of default configuration', function (done) {
        bos.use('/path/to/config');
    });

    it('should load all dependencies and init the service being tested', function (done) {
        bos.init('loader-external', function () {
            done();
        });
    });

    it('should load all depenencies', function (done) {
        bos.getDependencies('loader-external', function () {  

        });
    });
});


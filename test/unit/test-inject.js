var bot = require('../../index'),
    expect = bot.expect;

describe('lib | inject', function () {
    var inject, injectNativeServices;

    beforeEach(function () {
        inject = bot.expose('../../lib/inject');
    });

    afterEach(function () {
        bot.reset();
    });

    it('Should inject core BlueOak services', function (done) {
        injectNativeServices = bot.get(inject, 'injectNativeServices');

        injectNativeServices().then(function (bos) {
            expect(bos.config).to.be.defined;
            expect(bos.logger).to.be.defined;
            expect(bos.auth).to.be.defined;
            expect(bos.cache).to.be.defined;
            expect(bos.middleware).to.be.defined;
            expect(bos.monitor).to.be.defined;
            expect(bos.redis).to.be.defined;
            expect(bos.stats).to.be.defined;
            expect(bos.swagger).to.be.defined;
            expect(bos.system).to.be.defined;

            done();
        })
        .catch(done);
    });

    it('Should reject invalid service exclusions', function (done) {
        injectNativeServices = bot.get(inject, 'injectNativeServices');

        var botConfig = { exclude: ['logger'] };

        injectNativeServices(botConfig).then(function () {
            expect.toFail(); 
            done();
        })
        .catch(function (error) {
            expect(error.toString()).to.equal('Error: logger cannot be excluded from injection');
            done();
        });
    });
});


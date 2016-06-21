/* jshint expr:true */

var bot = require('../../index'),
    expect = bot.expect;

describe('lib | inject', function () {
    var inject;

    beforeEach(function () {
        inject = bot.expose('../../lib/inject');
    });

    afterEach(function () {
        bot.flush();
    });

    it('Should inject core BlueOak services', function (done) {
        var injectNativeServices = bot.get(inject, 'injectNativeServices');

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
        var injectNativeServices = bot.get(inject, 'injectNativeServices');

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

    it('Should load the native config services', function (done) {
        var injectConfig = bot.get(inject, 'injectConfig');

        injectConfig().then(function (config) {
            expect(config.get).to.be.a.function;
            expect(config.get('logger').levels.silly).to.equal(0);
            done();
        })
        .catch(done);
    });

    it('Should override default config values when a valid config path is supplied', function (done) {
        var injectConfig = bot.get(inject, 'injectConfig');

        var cBot = { configs: ['../data/config.base.json'] };

        injectConfig(cBot).then(function (config) {
            expect(config.get('logger').colors.silly).to.equal('pink');
            done();
        })
        .catch(done);
    });

    it('Should show non-overridden default values are still present', function (done) {
        var injectConfig = bot.get(inject, 'injectConfig');

        var cBot = { configs: ['../data/config.base.json'] };

        injectConfig(cBot).then(function (config) {
            expect(config.get('logger').colors.debug).to.equal('cyan');
            done();
        })
        .catch(done);
    });
});


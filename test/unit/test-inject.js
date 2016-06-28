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

    it('prep | Should return unaltered configuration if it\'s already defined', function () {
        var prep = bot.get(inject, 'prep');

        var cBot = { defined: true };

        expect(prep(cBot)).to.equal(cBot);
    });

    it('inject | Should yield service with its init\'d dependencies', function (done) {
        var cBot = { includeByPath: [__dirname + '/../data/services'] };

        bot.inject('fake-one', cBot).then(function (bos) {
            expect(bos.config).to.be.defined;
            expect(bos.logger).to.be.defined;
            expect(bos['fake-one']).to.be.defined;

            done();
        }).catch(done);
    });

    it('injectConfig | Should load the native config services', function (done) {
        var injectConfig = bot.get(inject, 'injectConfig');

        injectConfig().then(function (config) {
            expect(config.get).to.be.a.function;
            expect(config.get('logger').levels.silly).to.equal(0);
            done();
        })
        .catch(done);
    });

    it('injectConfig | Should override default config values when a valid config path is supplied', function (done) {
        var injectConfig = bot.get(inject, 'injectConfig');

        var cBot = { configs: [__dirname + '/../data/config.one.json'] };

        injectConfig(cBot).then(function (config) {
            expect(config.get('logger').colors.silly).to.equal('pink');
            done();
        })
        .catch(done);
    });

    it('injectConfig | Should show non-overridden default values are still present', function (done) {
        var injectConfig = bot.get(inject, 'injectConfig');

        var cBot = { configs: [__dirname + '/../data/config.one.json'] };

        injectConfig(cBot).then(function (config) {
            expect(config.get('logger').colors.debug).to.equal('cyan');
            done();
        })
        .catch(done);
    });

    it('injectConfig | Should reject with an error on failure to load config', function (done) {
        bot.get(inject, 'prep')();

        var injectConfig = bot.get(inject, 'injectConfig');
        var serviceLoader = bot.get(inject, 'serviceLoader');

        serviceLoader.init = function (arr, callback) {
            return callback(new Error('I\'m ded.'));
        };

        bot.set(inject, 'serviceLoader', serviceLoader);

        injectConfig().then(done).catch(function (error) {
            expect(error.toString()).to.equal('Error: I\'m ded.');
            done();
        });
    });

    it('injectNativeSerivces | Should inject core BlueOak services', function (done) {
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

    it('injectNativeServices | Should reject if serviceLoader fails', function (done) {
        var injectNativeServices = bot.get(inject, 'injectNativeServices'),
            prep = bot.get(inject, 'prep');

        prep();

        var serviceLoader = bot.get(inject, 'serviceLoader');
        serviceLoader.init = function (a, callback) { callback(new Error('serviceLoader failure')); };

        injectNativeServices().then(function () {
            expect.toFail();
            done();
        }).catch(function (error) {
            expect(error).to.be.an.Error;
            done();
        });
    });

    it('injectAppServices | Should inject and init dependencies from init signature', function () {
        var prep = bot.get(inject, 'prep');
        var injectAppServices = bot.get(inject, 'injectAppServices');
        var cBot = { includeByPath: [__dirname + '/../data/services'] };

        prep(cBot);

        injectAppServices('fake-one', cBot).then(function (service) {
            expect(service['fake-one'].echo('so fake')).to.equal('so fake');
        });
    });

    it('loadAppServices | Should return serviceLoader if includeByPath is not valid', function () {
        var loadAppServices = bot.get(inject, 'loadAppServices');
        var serviceLoader = { sample: 'true' };

        expect(loadAppServices({}, serviceLoader)).to.equal(serviceLoader);
    });

    it('loadAppServices | Should load services from includeByPath', function () {
        var prep = bot.get(inject, 'prep');
        var cBot = { includeByPath: [__dirname + '/../data/services'] };

        prep(cBot);

        var fake = global.services.get('fake-one');

        expect(fake.echo('so fake')).to.equal('so fake');
    });

    it('loadAppServices | Should reject if serviceLoader fails', function (done) {
        var injectAppServices = bot.get(inject, 'injectAppServices'),
            prep = bot.get(inject, 'prep');

        prep();

        var serviceLoader = bot.get(inject, 'serviceLoader');
        serviceLoader.init = function (a, callback) { callback(new Error('serviceLoader failure')); };

        injectAppServices().then(function () {
            expect.toFail();
            done();
        }).catch(function (error) {
            expect(error).to.be.an.Error;
            done();
        });
    });
});

/* jshint expr:true */

var bot = require('../../index'),
    expect = bot.expect;

describe('lib | config', function () {
    var config;

    beforeEach(function () {
        config = bot.expose('../../lib/config');
    });

    it('setSources | Should throw when configs property is not an array', function () {
        var setSources = bot.get(config, 'setSources');
        expect(setSources.bind(null, 'ugh')).to.throw(Error);
    });

    it('setSources | Should set empty array for configs property if not present', function () {
        var setSources = bot.get(config, 'setSources');
        var cBot = setSources();

        expect(cBot.configs).to.have.length(0);
    });

    it('setDefaultValues | Should populate config with BlueOak defaults', function () {
        bot.get(config, 'setDefaultValues')();
        var _config = bot.get(config, 'config');

        expect(_config.logger.colors.silly).to.equal('magenta');
    });

});


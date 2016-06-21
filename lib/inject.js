var cLocal = require('../config/local'),
    callsite = require('callsite'),
    path = require('path'),
    Promise = require('bluebird'),
    EventEmitter = require('events').EventEmitter,
    config = require('./config'),
    blueOakLoader = require(cLocal.blueOak + 'lib/loader'),
    serviceLoader;

/**
 *
 * Note: Given the number of config-related variables, I've chosen to use the
 * prefix `c` to denote a reference to a configuration file.
 */
function inject(service, cBot, cOverride) {
    cBot = prep(cBot);

    return injectConfig(cBot, cOverride)
        .then(function (configService) {
            return injectNativeServices(configService, cBot, cOverride);
        });

    // validate services
    // injectConfig
    // injectNative
    // injectExternal
    // Init config serivce alone first, use rewire to replace the config cache property with
    // the configuration passed in by the user
    // load config if exists
}

function prep(cBot) {
    if (serviceLoader) {
        return cBot;
    }

    var stack = callsite(),
        caller = stack[2].getFileName();

    cBot = cBot || {};
    cBot._cwd = path.dirname(caller);

    serviceLoader = blueOakLoader();

    require(cLocal.blueOak + 'lib/project')(serviceLoader);

    serviceLoader.loadServices(cLocal.blueOak + '/services', true);
    serviceLoader.loadServices(__dirname + '/../services', true);

    serviceLoader.inject('events', new EventEmitter());
    serviceLoader.inject('serviceLoader', serviceLoader);
    serviceLoader.inject('app', {}, ['middleware']);

    global.services = serviceLoader.getRegistry();
    global.__appDir = path.normalize(path.join(process.mainModule.filename, '../'));

    process.env.SUPPRESS_NO_CONFIG_WARNING = true;

    return cBot;
}

function flush() {
    serviceLoader = null;

    delete global.services;
    delete global.__appDir;
}

function injectConfig(cBot) {
    cBot = prep(cBot);

    return new Promise(function (resolve, reject) {
        serviceLoader.init(['loader-config'], function (error) {
            if (error) {
                return reject(error);
            }

            return config.merge(cBot).then(resolve);
        });
    });
}

function injectNativeServices(cBot) {
    cBot = prep(cBot);

    return new Promise(function (resolve, reject) {
        var toInit = [
            'config',
            'logger',
            'auth',
            'cache',
            'middleware',
            'monitor',
            'redis',
            'stats',
            'swagger',
            'system',
            'loader-native'
        ];

        var invalid = getInvalidExclusions(toInit, cBot.exclude);

        if (invalid.length > 0) {
            return reject(new Error(invalid.join(', ') + ' cannot be excluded from injection'));
        }

        serviceLoader.init(toInit, function (error) {
            if (error) {
                return reject(error);
            }

            return resolve(global.services.get('loader-native').getDependencies());
        });
    });
}

function getInvalidExclusions(toInit, exclude) {
    if (!exclude || exclude.length === 0) {
        return true;
    }

    var invalid = [];
    for (var i = 0; i < exclude.length; i++) {
        if (toInit.indexOf(exclude[i]) !== -1) {
            invalid.push(exclude[i]);
        }
    }

    return invalid;
}

module.exports = {
    inject: inject,
    flush: flush
};

var local = require('../local'),
    path = require('path'),
    Promise = require('bluebird'),
    EventEmitter = require('events').EventEmitter,
    configLoader = require('./config-loader'),
    blueOakLoader = require(local.blueOak + 'lib/loader');

serviceLoader = blueOakLoader();
require(local.blueOak + 'lib/project')(serviceLoader);

global.services = serviceLoader.getRegistry();
global.__appDir = path.normalize(path.join(process.mainModule.filename, '../'));

process.env.SUPPRESS_NO_CONFIG_WARNING = true;

function inject(botConfig, overrideConfig) {
    //injectNativeServices(botConfig)
    // override config

    // validate services

    // load config if exists

    // require core services

    // initialize services

    // require local services

    // initialize local services

    // callback
}

function injectNativeServices(config) {
    return new Promise(function (resolve, reject) {
        var nativeServices;

        config = config || {};

        serviceLoader.loadServices(local.blueOak + '/services', true);
        serviceLoader.loadServices(__dirname + '/../services', true);

        serviceLoader.inject('events', new EventEmitter());
        serviceLoader.inject('serviceLoader', serviceLoader);
        serviceLoader.inject('app', {}, ['middleware']);

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

        var invalid = getInvalidExclusions(toInit, config.exclude);

        if (invalid.length > 0) {
            return reject(new Error(invalid.join(', ') + ' cannot be excluded from injection'));
        }

        serviceLoader.init(toInit, function (error) {
            if (error) {
                return reject(error);
            }

            return resolve(global.services.get('loader-native').all());
        });
    });
}

function injectLocalServices() {
    serviceLoader.loadServices(__dirname + '/../services', true);
}

function injectExternalServices() {

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
    inject: inject
};

var cLocal = require('../config/local'),
    path = require('path'),
    Promise = require('bluebird'),
    EventEmitter = require('events').EventEmitter,
    _ = require('lodash'),
    config = require('./config'),
    blueOakLoader = require(cLocal.blueOak + 'lib/loader'),
    serviceLoader;

/**
 *
 * Note: Given the number of config-related variables, I've chosen to use the
 * prefix `c` to denote a reference to a configuration file.
 */
function inject(serviceName, cBot, cOverride) {
    cBot = prep(cBot);

    var services = {};
    return injectConfig(cBot, cOverride)
        .then(function (configService) {
            services.config = configService;
            return injectNativeServices(cBot);
        })
        .then(function (nativeServices) {
            services = _.merge(services, nativeServices);
            return injectExternalServices(serviceName, cBot);
        }).then(function (externalServices) {
            services = _.merge(services, externalServices);
            return services;
        });
}

function prep(cBot) {
    if (serviceLoader) {
        return cBot;
    }

    cBot = cBot || {};

    serviceLoader = blueOakLoader();

    require(cLocal.blueOak + 'lib/project')(serviceLoader);

    serviceLoader.loadServices(cLocal.blueOak + '/services', true);
    serviceLoader.loadServices(__dirname + '/../services', true);

    serviceLoader = loadExternalServices(cBot, serviceLoader);

    serviceLoader.inject('events', new EventEmitter());
    serviceLoader.inject('serviceLoader', serviceLoader);
    serviceLoader.inject('app', {}, ['middleware']);

    global.services = serviceLoader.getRegistry();
    global.__appDir = path.normalize(path.join(process.mainModule.filename, '../'));

    process.env.SUPPRESS_NO_CONFIG_WARNING = true;

    return cBot;
}

function stubServices() {

}

function injectExternalServices(name, cBot) {
    return new Promise(function (resolve, reject) {
        serviceLoader.init([name], function (error) {
            if (error) {
                return reject(error);
            }

            global.services.get(name, function (service) {
                var services = {},
                    args = /init\((.+)\)/.exec(service.init.toString())[1].replace(/\s/g, '').split(',');

                services[name] = service;

                for (var i = 0; i < args.length; i++) {
                    name = normalizeServiceName(args[i]);
                    services[name] = global.services.get(name);
                }

                return resolve(services);
            });
        });
    });

}

function normalizeServiceName(str) {
    if (/^_.+_$/.test(str)) {
        str = str.slice(1, str.length);
        str = str.slice(0, str.length - 1);
    }

    return str.replace(/([A-Z])/g, '-$1').replace(/[-_\s]+/g, '-').toLowerCase();
}

function loadExternalServices(cBot, serviceLoader) {
    if (!cBot.includeByPath || !Array.isArray(cBot.includeByPath)) {
        return serviceLoader;
    }

    for (var i = 0; i < cBot.includeByPath.length; i++) {
        serviceLoader.loadServices(cBot.includeByPath[i], true)
    }

    return serviceLoader;
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

        serviceLoader.init(toInit, function (error) {
            if (error) {
                return reject(error);
            }

            return resolve(global.services.get('loader-native').getDependencies());
        });
    });
}

function flush() {
    serviceLoader = null;
    delete global.services;
    delete global.__appDir;
}

module.exports = {
    inject: inject,
    flush: flush
};

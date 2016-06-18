var fs = require('fs'),
    async = require('async'),
    path = require('path'),
    EventEmitter = require('events').EventEmitter,
    stripJsonComments = require('strip-json-comments');

var BLUEOAK = __dirname + '/../node_modules/blueoak-server/';

var di = require(BLUEOAK + 'lib/di'),
    loader = require(BLUEOAK + 'lib/loader'),
    security = require(BLUEOAK + 'lib/security'),
    serviceLoader = loader(),
    project = require(BLUEOAK + 'lib/project')(serviceLoader);

    global.services = serviceLoader.getRegistry();
    global.__appDir = path.normalize(path.join(process.mainModule.filename, '../'));

function inject(services, config, callback) {
    if (!callback) {
        callback = config;
        config = {};
    }

    var nativeServices;

    serviceLoader.loadServices(BLUEOAK + '/services', true);
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

    serviceLoader.init(toInit, function(err) {
        nativeServices = global.services.get('loader-native').all();
        console.log(nativeServices);

        // override config
    });

    // validate services    

    // load config if exists

    // require core services

    // initialize services

    // require local services

    // initialize local services

    // callback
}

function setConfig(config, callback) {
    if (typeof config === 'string') {
        config = loadConfigFromPath(config);
    }

    config = setConfigDefaults(config);

    decryptConfig(config, function (error, config) {
        callback(false, {
            get: function(id) {
                return config[id] || {};
            }
        });
    });
}

function setConfigDefaults (config) {
    return setConfigDefaultValues(loadConfigFromPath(path.join(__dirname, '/../defaults.json')), config);
}

function setConfigDefaultValues (defaultConfig, config) {
    for (var property in defaultConfig) {
        if (typeof defaultConfig[property] === 'object' && !(defaultConfig[property] instanceof Array)) {
            if (!config[property]) {
                config[property] = {};
            }

            setConfigDefaultValues(defaultConfig[property], config[property]);
        } else {
            if (!config[property]) {
                config[property] = defaultConfig[property];
            }
        }
    }

    return config;
}

function decryptConfig(config, callback) {
    if (security.containsEncryptedData(config)) {
        if (!process.env.decryptionKey) {
            throw new Error('Configuration contains encrypted data, yet the env variable `decryptionKey` is not set');
        }

        security.decryptObject(config, function (str) {
            config = security.decrypt(str, result);
            callback(false, config);
        });
    } else {
        callback(false, config);
    }
}

function loadConfigFromPath (path) {
    var json = fs.readFileSync(path, 'utf-8');
    json = stripJsonComments(json);
    json = JSON.parse(json);

    return json;
}

module.exports = {
    inject: inject
};

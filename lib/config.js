var cLocal = require('../config/local'),
    path = require('path'),
    fs = require('fs'),
    _ = require('lodash'),
    Promise = require('bluebird'),
    stripJsonComments = require('strip-json-comments'),
    security = require(cLocal.blueOak + 'lib/security');

var config;

function setSources(cBot) {
    cBot = cBot || {};
    cBot.configs = cBot.configs || [];

    if (!Array.isArray(cBot.configs)) {
        throw new Error('bot configuration is malformed. configs property must be an array');
    }

    return cBot;
}

function setDefaultValues() {
    config = loadFromPath(cLocal.blueOak + 'defaults.json');
}

function overrideDefaultGet(configService) {
    configService.get = function (key) {
        return config[key] || {};
    };

    return configService;
}

function merge(cBot, cOverride) {
    var configService = global.services.get('loader-config').getDependencies().config;

    setDefaultValues();
    configService = overrideDefaultGet(configService);
    cBot = setSources(cBot);

    if (!cOverride && cBot.configs.length === 0) {
        return Promise.resolve(configService);
    }

    return new Promise(function (resolve, reject) {
        var tmp;

        for (var i = 0; i < cBot.configs.length; i++) {
            if (typeof cBot.configs[i] === 'string') {
                tmp = loadFromPath(cBot.configs[i]);
                config = _.merge(config, tmp);
            } else if (typeof config === 'object') {
                config = _.merge(config, tmp);
            }
        }

        if (cOverride) {
            config = _.merge(config, cOverride);
        }

        decrypt(config, function (error, decrypted) {
            if (error) {
                return reject(error);
            }

            config = decrypted;
            return resolve(configService);
        });
    });
}

function decrypt(config, callback) {
    if (security.containsEncryptedData(config)) {
        security.decryptObject(config, function (str) {
            config = security.decrypt(str, config);
            callback(false, config);
        });
    } else {
        callback(false, config);
    }
}

function loadFromPath(path) {
    var json = fs.readFileSync(path, 'utf-8');
    json = stripJsonComments(json);
    json = JSON.parse(json);

    return json;
}

module.exports = {
    merge: merge
};

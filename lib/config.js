var cLocal = require('../config/local'),
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
    var configService = global.services.get('config');

    setDefaultValues();
    configService = overrideDefaultGet(configService);
    cBot = setSources(cBot);

    var i;

    for (i = 0; i < cBot.configs.length; i++) {
        config = _.merge(config, loadFromPath(cBot.configs[i]));
    }

    if (cOverride) {
        config = _.merge(config, cOverride);
    }

    if (!cBot.logging) {
        for (i = 0; i < config.logger.transports.length; i++) {
            config.logger.transports[i].options.level = 'silent';
        }
    }

    decrypt(config);

    return configService;
}

function decrypt(config) {
    if (security.containsEncryptedData(config)) {
        security.decryptObject(config, function (str) {
            return security.decrypt(str, process.env.decryptionKey);
        });
    }

    return config;
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

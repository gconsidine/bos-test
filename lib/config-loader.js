var local = require('../local'),
    stripJsonComments = require('strip-json-comments'),
    security = require(local.blueOak + 'lib/security');

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

function setConfigDefaults(config) {
    var path = path.join(__dirname, '/../defaults.json');

    return setConfigDefaultValues(loadConfigFromPath(path), config);
}

function setConfigDefaultValues(defaults, config) {
    for (var property in defaults) {
        if (typeof defaults[property] === 'object' && !Array.isArray(defaults[property])) {
            if (!config[property]) {
                config[property] = {};
            }

            setConfigDefaultValues(defaults[property], config[property]);
        } else {
            if (!config[property]) {
                config[property] = defaults[property];
            }
        }
    }

    return config;
}

function decryptConfig(config, callback) {
    if (security.containsEncryptedData(config)) {
        if (!process.env.decryptionKey) {
            throw new Error('Set the env variable `decryptionKey` to decrypt your config');
        }

        security.decryptObject(config, function (str) {
            config = security.decrypt(str, result);
            callback(false, config);
        });
    } else {
        callback(false, config);
    }
}

function loadConfigFromPath(path) {
    var json = fs.readFileSync(path, 'utf-8');
    json = stripJsonComments(json);
    json = JSON.parse(json);

    return json;
}

module.exports = {};

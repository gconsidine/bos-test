var services;

function init(_config_, callback) {
    services = function () {
        return {
            config: _config_
        };
    };

    callback();
}

function getDependencies() {
    return services();
}

module.exports = {
    init: init,
    getDependencies: getDependencies
};

var services;

function init(_auth_, _cache_, _config_, _express_, _logger_, _middleware_,
              _monitor_, _postMiddleware_, _redis_, _stats_, _swagger_,
              _system_, callback) {

    services = function () {
        return {
            auth: _auth_,
            cache: _cache_,
            config: _config_,
            express: _express_,
            logger: _logger_,
            middleware: _middleware_,
            monitor: _monitor_,
            postMiddleware: _postMiddleware_,
            redis: _redis_,
            stats: _stats_,
            swagger: _swagger_,
            system: _system_
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
